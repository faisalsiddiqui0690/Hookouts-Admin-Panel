import ReactApexCharts from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { Fragment, useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, usersAPI, type DashboardStats, type AnalyticsData, type DetailedAnalytics } from '../services/api';

// Memoized chart option generators to avoid recreating on every render
const createSparklineOptions = (type: 'area' | 'bar', color: string): ApexOptions => ({
    chart: { type, height: 50, sparkline: { enabled: true } },
    stroke: { width: 0, curve: 'smooth' },
    plotOptions: type === 'bar' ? { bar: { borderRadius: 3, columnWidth: '30%' } } : undefined,
    fill: type === 'area' ? {
        type: 'gradient',
        gradient: { shade: 'light', type: 'vertical', opacityFrom: 0.9, opacityTo: 0.3, stops: [0, 100] },
    } : undefined,
    markers: { size: 0 },
    colors: [color],
    tooltip: { fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: () => '' } }, marker: { show: false } },
});

const createHeatmapOptions = (isDarkMode: boolean, data: any[]): ApexOptions => ({
    chart: { height: 280, type: 'heatmap', toolbar: { show: false }, background: 'transparent', foreColor: isDarkMode ? '#e0e0e0' : '#495057' },
    dataLabels: { enabled: false },
    colors: ['#22b956'],
    series: data,
    xaxis: { type: 'category', labels: { style: { colors: isDarkMode ? '#b0b0b0' : '#6c757d', fontSize: '12px' } } },
    yaxis: { labels: { style: { fontSize: '11px', colors: isDarkMode ? '#b0b0b0' : '#6c757d' } } },
    grid: { borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
    plotOptions: {
        heatmap: {
            shadeIntensity: 0.3,
            radius: 2,
            colorScale: {
                ranges: isDarkMode ? [
                    { from: 0, to: 20, color: '#0f3d1e' },
                    { from: 21, to: 40, color: '#1a5c32' },
                    { from: 41, to: 60, color: '#22b956' },
                    { from: 61, to: 80, color: '#2dd86a' },
                ] : [
                    { from: 0, to: 20, color: '#f0fdf4' },
                    { from: 21, to: 40, color: '#bbf7d0' },
                    { from: 41, to: 60, color: '#86efac' },
                    { from: 61, to: 80, color: '#4ade80' },
                ]
            }
        }
    },
    tooltip: { theme: isDarkMode ? 'dark' : 'light' },
});

const createAreaChartOptions = (isDarkMode: boolean): ApexOptions => ({
    chart: { height: 280, type: 'area', toolbar: { show: false }, background: 'transparent', foreColor: isDarkMode ? '#e0e0e0' : '#495057' },
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 90, 100] } },
    dataLabels: { enabled: false },
    colors: ['#22b956'],
    xaxis: { categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], labels: { style: { fontSize: '11px', colors: isDarkMode ? '#b0b0b0' : '#6c757d' } } },
    yaxis: { labels: { formatter: (val) => val.toFixed(0), style: { fontSize: '11px', colors: isDarkMode ? '#b0b0b0' : '#6c757d' } } },
    grid: { borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f1f3fa' },
    markers: { size: 3, strokeWidth: 0 },
    tooltip: { theme: isDarkMode ? 'dark' : 'light' },
});

const createBarChartOptions = (activityData: number[]): ApexOptions => ({
    chart: { height: 280, type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 2, columnWidth: '30%', dataLabels: { position: 'top' } } },
    dataLabels: { enabled: true, formatter: (val) => val + '+', offsetY: -25, style: { fontSize: '12px', colors: ['#304758'] } },
    colors: ['#4d5761'],
    legend: { show: true, horizontalAlign: 'center', offsetX: 0, offsetY: -5 },
    series: [{ name: 'User Activity', data: activityData }],
    xaxis: { categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], position: 'bottom', labels: { offsetY: 0 }, axisBorder: { show: true }, axisTicks: { show: true } },
    yaxis: { axisBorder: { show: true }, axisTicks: { show: true }, labels: { show: true, formatter: (val) => val + '+' } },
    grid: { row: { colors: ['transparent', 'transparent'], opacity: 0.2 }, borderColor: '#f1f3fa' },
});

export const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [detailedAnalytics, setDetailedAnalytics] = useState<DetailedAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Theme observer - optimized with cleanup
    useEffect(() => {
        setIsDarkMode(document.documentElement.getAttribute('data-bs-theme') === 'dark');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-bs-theme') {
                    setIsDarkMode(document.documentElement.getAttribute('data-bs-theme') === 'dark');
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    // Fetch data - single optimized call
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Fetching dashboard data...');
                const [dashboardStats, recentUsersData, allUsersData, analyticsData, detailedData] = await Promise.all([
                    dashboardAPI.getStats(),
                    usersAPI.getRecent(10),
                    usersAPI.getAll(),
                    dashboardAPI.getAnalytics('7d'),
                    dashboardAPI.getDetailedAnalytics(),
                ]);
                
                console.log('Dashboard data loaded:', { dashboardStats, recentUsersData, analyticsData });
                setStats(dashboardStats);
                setRecentUsers(recentUsersData);
                setAllUsers(allUsersData);
                setAnalytics(analyticsData);
                setDetailedAnalytics(detailedData);
                setError(null);
            } catch (err: any) {
                console.error('Dashboard fetch error:', err);
                console.error('Error details:', err.message, err.response?.data);
                setError(`Failed to load dashboard data: ${err.message || 'Unknown error'}`);
                setStats(null);
                setRecentUsers([]);
                setAllUsers([]);
                setAnalytics(null);
                setDetailedAnalytics(null);
            } finally {
                setLoading(false);
                console.log('Loading state set to false');
            }
        };
        fetchData();
    }, []);

    // Lucide icons initialization - debounced
    useEffect(() => {
        const initIcons = () => {
            if ((window as any).lucide) {
                (window as any).lucide.createIcons();
            }
        };
        
        const timer = setTimeout(initIcons, 100);
        return () => clearTimeout(timer);
    }, [loading, stats, recentUsers, analytics]);

    // Search listener - optimized
    useEffect(() => {
        const handleSearch = (e: Event) => setSearchQuery((e.target as HTMLInputElement).value.toLowerCase());
        const searchInput = document.getElementById('dashboardSearch');
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
            return () => searchInput.removeEventListener('input', handleSearch);
        }
    }, []);

    // Memoized calculations
    const shouldShowCard = useCallback((keywords: string[]) => 
        !searchQuery || keywords.some(k => k.toLowerCase().includes(searchQuery)),
        [searchQuery]
    );

    const activityData = useMemo(() => analytics?.activityData || [], [analytics]);
    
    const weeklyActivityData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const base = analytics?.activityData || [];
        return [
            { name: 'Active Users', data: base.map((v, i) => ({ x: days[i], y: Math.round(v * 0.8) })) },
            { name: 'New Users', data: base.map((v, i) => ({ x: days[i], y: Math.round(v * 0.5) })) },
            { name: 'Matches', data: base.map((v, i) => ({ x: days[i], y: Math.round(v * 0.6) })) },
            { name: 'Chats', data: base.map((v, i) => ({ x: days[i], y: Math.round(v * 0.7) })) },
            { name: 'Premium', data: base.map((v, i) => ({ x: days[i], y: Math.round(v * 0.3) })) },
        ];
    }, [analytics]);

    const userGrowthTrendSeries = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return [{ name: 'New Users', data: (analytics?.userGrowth || []).map((v, i) => ({ x: days[i], y: v })) }];
    }, [analytics]);

    // Memoized chart options
    const sparklineAreaOptions = useMemo(() => createSparklineOptions('area', '#4d5761'), []);
    const sparklineBarOptions = useMemo(() => createSparklineOptions('bar', '#22b956'), []);
    const heatmapOptions = useMemo(() => createHeatmapOptions(isDarkMode, weeklyActivityData), [isDarkMode, weeklyActivityData]);
    const areaChartOptions = useMemo(() => createAreaChartOptions(isDarkMode), [isDarkMode]);
    const barChartOptions = useMemo(() => createBarChartOptions(activityData), [activityData]);

    const newUsersThisMonth = useMemo(() => {
        if (!allUsers.length) return 0;
        const now = new Date();
        return allUsers.filter(u => {
            const date = new Date(u.createdAt || '');
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length;
    }, [allUsers]);

    const totalInteractions = useMemo(() => 
        activityData.reduce((a, b) => a + b, 0),
        [activityData]
    );

    const avgDailyActivity = useMemo(() => 
        activityData.length ? Math.round(totalInteractions / 7) : 0,
        [activityData, totalInteractions]
    );

    const engagementRate = useMemo(() => {
        const dau = detailedAnalytics?.dau || 0;
        const mau = detailedAnalytics?.mau || 1;
        return ((dau / mau) * 100).toFixed(1);
    }, [detailedAnalytics]);

    if (loading) {
        return (
            <div className="page-content" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <Fragment>
            <div className="page-content" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                {error && (
                    <div className="col-12 mb-3">
                        <div className="alert alert-warning alert-dismissible fade show">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="row">
                    {shouldShowCard(['total users', 'users']) && (
                        <div className="col-xl-3 col-md-6">
                            <div className="card" onClick={() => window.location.href = '/users'} style={{ cursor: 'pointer' }}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <p className="mb-3 card-title">Total Users</p>
                                            <h4 className="fw-bold text-primary mb-0">{stats?.totalUsers.toLocaleString() || '0'}</h4>
                                        </div>
                                        <i data-lucide="users" className="fs-32 text-primary"></i>
                                    </div>
                                    <ReactApexCharts options={sparklineAreaOptions} series={[{ data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54] }]} type="area" height={50} />
                                </div>
                            </div>
                        </div>
                    )}

                    {shouldShowCard(['active users', 'active']) && (
                        <div className="col-xl-3 col-md-6">
                            <div className="card" onClick={() => window.location.href = '/users'} style={{ cursor: 'pointer' }}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <p className="mb-3 card-title">Active Users</p>
                                            <h4 className="fw-bold mb-0">{stats?.activeUsers.toLocaleString() || '0'}</h4>
                                        </div>
                                        <i data-lucide="user-check" className="fs-32 text-primary"></i>
                                    </div>
                                    <ReactApexCharts options={sparklineBarOptions} series={[{ data: [17, 83, 56, 45, 29, 92, 38, 72, 11, 67, 53, 29, 92, 18, 16, 11] }]} type="bar" height={50} />
                                </div>
                            </div>
                        </div>
                    )}

                    {shouldShowCard(['new this month', 'new users']) && (
                        <div className="col-xl-3 col-md-6">
                            <div className="card" onClick={() => window.location.href = '/users'} style={{ cursor: 'pointer' }}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <p className="mb-3 card-title">New This Month</p>
                                            <h4 className="fw-bold text-primary mb-0">{newUsersThisMonth}</h4>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fs-32 text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                                    </div>
                                    <ReactApexCharts options={sparklineAreaOptions} series={[{ data: [45, 12, 78, 31, 56, 89, 22, 67, 41, 53, 96] }]} type="area" height={50} />
                                </div>
                            </div>
                        </div>
                    )}

                    {shouldShowCard(['total matches', 'matches']) && (
                        <div className="col-xl-3 col-md-6">
                            <div className="card" style={{ cursor: 'pointer' }}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <p className="mb-3 card-title">Total Matches</p>
                                            <h4 className="fw-bold mb-0">{stats?.totalMatches.toLocaleString() || '0'}</h4>
                                        </div>
                                        <i data-lucide="heart" className="fs-32 text-primary"></i>
                                    </div>
                                    <ReactApexCharts options={sparklineBarOptions} series={[{ data: [92, 18, 16, 11, 8, 5, 25, 83, 56, 45, 72, 11, 67, 53, 29, 92] }]} type="bar" height={50} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Engagement Cards - Full Width Single Row */}
                <div className="row mt-4">
                    {shouldShowCard(['likes today', 'likes']) && (
                        <div className="col-xl-4 col-md-4">
                            <div className="card" onClick={() => navigate('/likes')} style={{ cursor: 'pointer' }}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <p className="text-uppercase fw-medium mb-0">Likes Today</p>
                                            <h5 className="my-3">{detailedAnalytics?.likesToday.toLocaleString() || '0'}</h5>
                                        </div>
                                        <div className="avatar-sm">
                                            <span className="avatar-title bg-soft-danger text-danger rounded-circle"><i className="bi bi-heart-fill"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {shouldShowCard(['messages today', 'messages']) && (
                        <div className="col-xl-4 col-md-4">
                            <div className="card" onClick={() => navigate('/messages')} style={{ cursor: 'pointer' }}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <p className="text-uppercase fw-medium mb-0">Messages Today</p>
                                            <h5 className="my-3">{detailedAnalytics?.messagesToday.toLocaleString() || '0'}</h5>
                                        </div>
                                        <div className="avatar-sm">
                                            <span className="avatar-title bg-soft-success text-success rounded-circle"><i className="bi bi-chat-dots-fill"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {shouldShowCard(['online now', 'online']) && (
                        <div className="col-xl-4 col-md-4">
                            <div className="card" onClick={() => navigate('/online-users')} style={{ cursor: 'pointer' }}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <p className="text-uppercase fw-medium mb-0">Online Now</p>
                                            <h5 className="my-3">{detailedAnalytics?.onlineUsers.toLocaleString() || '0'}</h5>
                                        </div>
                                        <div className="avatar-sm">
                                            <span className="avatar-title bg-soft-info text-info rounded-circle"><i className="bi bi-wifi"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Charts Row */}
                <div className="row mt-4">
                    <div className="col-xl-4 col-lg-6">
                        <div className="card" style={{ height: '100%', border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.125)' }}>
                            <div className="card-header d-flex justify-content-between" style={{ borderBottom: isDarkMode ? '1px dashed rgba(255, 255, 255, 0.1)' : '1px dashed rgba(0, 0, 0, 0.1)' }}>
                                <h4 className="card-title mb-0">Weekly Activity Heatmap</h4>
                                <span className="badge bg-success fs-12">Last 7 Days</span>
                            </div>
                            <div className="card-body pb-2">
                                <p className="text-muted text-center mb-2">Total interactions: <span className="text-primary fw-bold">{totalInteractions}</span></p>
                                <ReactApexCharts options={heatmapOptions} series={weeklyActivityData} type="heatmap" height={280} />
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-4 col-lg-6">
                        <div className="card" style={{ height: '100%' }}>
                            <div className="card-header d-flex justify-content-between">
                                <h4 className="card-title mb-0">Daily Activity</h4>
                            </div>
                            <div className="card-body pb-2">
                                <p className="text-muted text-center mb-2">Average daily: <span className="text-success fw-bold">{avgDailyActivity}</span></p>
                                <ReactApexCharts options={barChartOptions} series={[{ name: 'Activity', data: activityData }]} type="bar" height={280} />
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-4 col-lg-12">
                        <div className="card" style={{ height: '100%' }}>
                            <div className="card-header d-flex justify-content-between">
                                <h4 className="card-title mb-0">User Growth Trend</h4>
                                <span className="badge bg-primary fs-12">7 Days</span>
                            </div>
                            <div className="card-body ps-0 pb-2">
                                <p className="text-muted text-center mb-2">New users: <span className="text-primary fw-bold">{userGrowthTrendSeries[0].data.reduce((a: number, b: any) => a + (typeof b === 'number' ? b : b.y), 0)}</span></p>
                                <ReactApexCharts options={areaChartOptions} series={userGrowthTrendSeries} type="area" height={280} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Statistics */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title mb-0">Profile Statistics</h4></div>
                            <div className="card-body">
                                <div className="row g-4">
                                    <div className="col-md-3 text-center p-3 border rounded">
                                        <i className="bi bi-person-check fs-1 text-primary mb-2"></i>
                                        <h3 className="mb-0">{detailedAnalytics?.profilesCompleted || 0}</h3>
                                        <p className="text-muted mb-0">Completed Profiles</p>
                                    </div>
                                    <div className="col-md-3 text-center p-3 border rounded">
                                        <i className="bi bi-percent fs-1 text-success mb-2"></i>
                                        <h3 className="mb-0">{detailedAnalytics?.avgCompletionPercent || 0}%</h3>
                                        <p className="text-muted mb-0">Avg Completion</p>
                                    </div>
                                    <div className="col-md-3 text-center p-3 border rounded">
                                        <i className="bi bi-image fs-1 text-info mb-2"></i>
                                        <h3 className="mb-0">{detailedAnalytics?.usersWithPhotos || 0}</h3>
                                        <p className="text-muted mb-0">Users with Photos</p>
                                    </div>
                                    <div className="col-md-3 text-center p-3 border rounded">
                                        <i className="bi bi-card-text fs-1 text-warning mb-2"></i>
                                        <h3 className="mb-0">{detailedAnalytics?.usersWithBio || 0}</h3>
                                        <p className="text-muted mb-0">Users with Bio</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Engagement Statistics */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title mb-0">Engagement Statistics</h4></div>
                            <div className="card-body">
                                <div className="row g-3">
                                    {shouldShowCard(['total likes']) && (
                                        <div className="col-md-2 col-sm-6" onClick={() => navigate('/likes')} style={{ cursor: 'pointer' }}>
                                            <div className="text-center p-2 bg-soft-primary rounded">
                                                <h5 className="mb-1 text-primary">{detailedAnalytics?.totalLikes || 0}</h5>
                                                <small className="text-muted">Total Likes</small>
                                            </div>
                                        </div>
                                    )}
                                    {shouldShowCard(['likes today']) && (
                                        <div className="col-md-2 col-sm-6" onClick={() => navigate('/likes')} style={{ cursor: 'pointer' }}>
                                            <div className="text-center p-2 bg-soft-success rounded">
                                                <h5 className="mb-1 text-success">{detailedAnalytics?.likesToday || 0}</h5>
                                                <small className="text-muted">Likes Today</small>
                                            </div>
                                        </div>
                                    )}
                                    {shouldShowCard(['super likes']) && (
                                        <div className="col-md-2 col-sm-6" onClick={() => navigate('/likes')} style={{ cursor: 'pointer' }}>
                                            <div className="text-center p-2 bg-soft-info rounded">
                                                <h5 className="mb-1 text-info">{detailedAnalytics?.superLikes || 0}</h5>
                                                <small className="text-muted">Super Likes</small>
                                            </div>
                                        </div>
                                    )}
                                    {shouldShowCard(['total messages']) && (
                                        <div className="col-md-2 col-sm-6" onClick={() => navigate('/messages')} style={{ cursor: 'pointer' }}>
                                            <div className="text-center p-2 bg-soft-warning rounded">
                                                <h5 className="mb-1 text-warning">{detailedAnalytics?.totalMessages || 0}</h5>
                                                <small className="text-muted">Total Messages</small>
                                            </div>
                                        </div>
                                    )}
                                    {shouldShowCard(['messages today']) && (
                                        <div className="col-md-2 col-sm-6" onClick={() => navigate('/messages')} style={{ cursor: 'pointer' }}>
                                            <div className="text-center p-2 bg-soft-danger rounded">
                                                <h5 className="mb-1 text-danger">{detailedAnalytics?.messagesToday || 0}</h5>
                                                <small className="text-muted">Messages Today</small>
                                            </div>
                                        </div>
                                    )}
                                    {shouldShowCard(['match rate']) && (
                                        <div className="col-md-2 col-sm-6">
                                            <div className="text-center p-2 bg-soft-primary rounded">
                                                <h5 className="mb-1 text-primary">{detailedAnalytics?.matchRate || 0}%</h5>
                                                <small className="text-muted">Match Rate</small>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Demographics */}
                <div className="row mt-4">
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title mb-0">Age Distribution</h4></div>
                            <div className="card-body">
                                {detailedAnalytics?.ageDistribution && Object.entries(detailedAnalytics.ageDistribution).map(([ageGroup, count]) => (
                                    <div key={ageGroup}>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="fw-medium">{ageGroup}</span>
                                            <span>{count as number}</span>
                                        </div>
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div className="progress-bar bg-primary" style={{ width: `${((count as number) / (detailedAnalytics.profilesTotal || 1)) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title mb-0">Gender Distribution</h4></div>
                            <div className="card-body">
                                {detailedAnalytics?.genderDistribution && Object.entries(detailedAnalytics.genderDistribution).map(([gender, count]) => (
                                    <div key={gender}>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="fw-medium">{gender}</span>
                                            <span>{count as number}</span>
                                        </div>
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div className={`progress-bar ${gender === 'MALE' ? 'bg-primary' : gender === 'FEMALE' ? 'bg-danger' : 'bg-warning'}`} style={{ width: `${((count as number) / (detailedAnalytics.profilesTotal || 1)) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscriptions & Safety */}
                <div className="row mt-4">
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title mb-0">Subscription Statistics</h4></div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="p-3 border rounded bg-soft-primary">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <p className="text-muted mb-1">Premium Users</p>
                                                    <h3 className="mb-0 text-primary fw-bold">{detailedAnalytics?.premiumUsers || 0}</h3>
                                                </div>
                                                <i className="bi bi-crown fs-1 text-primary"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="p-3 border rounded bg-soft-warning">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <p className="text-muted mb-1">Expiring Soon</p>
                                                    <h3 className="mb-0 text-warning fw-bold">{detailedAnalytics?.expiringSubscriptions || 0}</h3>
                                                </div>
                                                <i className="bi bi-clock-history fs-1 text-warning"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <h6 className="fw-semibold mb-2">By Tier:</h6>
                                    <div className="d-flex gap-2 flex-wrap">
                                        {detailedAnalytics?.subscriptionTiers && Object.entries(detailedAnalytics.subscriptionTiers).map(([tier, count]) => (
                                            <span key={tier} className="badge bg-primary fs-12 px-3 py-2">{tier}: {count as number}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title mb-0">Safety & Moderation</h4></div>
                            <div className="card-body">
                                <div className="text-center p-3 border rounded bg-soft-info">
                                    <i className="bi bi-slash-circle fs-2 text-info mb-2 d-block"></i>
                                    <h4 className="mb-0 text-info">{detailedAnalytics?.blocksCount || 0}</h4>
                                    <small className="text-muted">User Blocks</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Metrics */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title mb-0">Activity Metrics</h4></div>
                            <div className="card-body">
                                <div className="row g-4">
                                    <div className="col-md-3 text-center">
                                        <div className="avatar-md mx-auto mb-2">
                                            <span className="avatar-title bg-soft-success text-success rounded-circle fs-4"><i className="bi bi-calendar-check"></i></span>
                                        </div>
                                        <h3 className="mb-1">{detailedAnalytics?.dau || 0}</h3>
                                        <p className="text-muted mb-0">Daily Active Users</p>
                                    </div>
                                    <div className="col-md-3 text-center">
                                        <div className="avatar-md mx-auto mb-2">
                                            <span className="avatar-title bg-soft-info text-info rounded-circle fs-4"><i className="bi bi-calendar-week"></i></span>
                                        </div>
                                        <h3 className="mb-1">{detailedAnalytics?.mau || 0}</h3>
                                        <p className="text-muted mb-0">Monthly Active Users</p>
                                    </div>
                                    <div className="col-md-3 text-center" onClick={() => navigate('/online-users')} style={{ cursor: 'pointer' }}>
                                        <div className="avatar-md mx-auto mb-2">
                                            <span className="avatar-title bg-soft-primary text-primary rounded-circle fs-4"><i className="bi bi-wifi"></i></span>
                                        </div>
                                        <h3 className="mb-1">{detailedAnalytics?.onlineUsers || 0}</h3>
                                        <p className="text-muted mb-0">Online Right Now</p>
                                    </div>
                                    <div className="col-md-3 text-center">
                                        <div className="avatar-md mx-auto mb-2">
                                            <span className="avatar-title bg-soft-warning text-warning rounded-circle fs-4"><i className="bi bi-graph-up-arrow"></i></span>
                                        </div>
                                        <h3 className="mb-1">{engagementRate}%</h3>
                                        <p className="text-muted mb-0">Engagement Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Users & Recent Matches - 50/50 Split */}
                <div className="row">
                    <div className="col-xl-6 col-lg-12">
                        <div className="card" style={{ height: '100%' }}>
                            <div className="card-header d-flex justify-content-between">
                                <h4 className="card-title mb-0">New Users</h4>
                                <a href="/users" className="btn btn-sm btn-link text-uppercase fw-semibold px-0">View Users <i data-lucide="arrow-right"></i></a>
                            </div>
                            <div className="card-body p-0">
                                <div style={{ height: '388px', overflowY: 'auto' }} data-simplebar>
                                    {recentUsers.length > 0 ? recentUsers.map((user) => (
                                        <div key={user.id || user.userId} className="d-flex flex-wrap gap-3 border-bottom p-3">
                                            <img src={user.avatar || '/assets/images/users/avatar-1.jpg'} alt={user.name || 'User'} className="avatar-sm rounded-circle" />
                                            <div>
                                                <a href="#!" className="text-dark fs-15 fw-medium">{user.name || 'Unknown User'}</a>
                                                <p className="mb-2"><i data-lucide="mail" className="me-1 fs-12"></i>{user.email || 'No email'}</p>
                                                <p className="mb-0 fw-semibold"><i data-lucide="calendar" className="me-1 fs-12"></i>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently joined'}</p>
                                            </div>
                                            <div className="align-self-center ms-auto">
                                                <a href="#!" className="btn btn-sm btn-primary">View Profile</a>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-5">
                                            <i data-lucide="users" className="fs-40 text-muted mb-3"></i>
                                            <p className="text-muted">No recent users found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-6 col-lg-12">
                        <div className="card" style={{ height: '100%' }}>
                            <div className="card-header d-flex justify-content-between">
                                <h4 className="card-title mb-0">Recent Matches</h4>
                                <a href="/matches" className="btn btn-sm btn-link text-uppercase fw-semibold px-0">View All</a>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-sm table-hover mb-0">
                                        <thead>
                                            <tr><th>User 1</th><th>User 2</th><th>Status</th><th>Date</th></tr>
                                        </thead>
                                        <tbody>
                                            {detailedAnalytics?.recentMatches && detailedAnalytics.recentMatches.slice(0, 8).map((match: any, index: number) => (
                                                <tr key={match.id || index}>
                                                    <td className="fw-medium">{match.user1 || 'User 1'}</td>
                                                    <td className="fw-medium">{match.user2 || 'User 2'}</td>
                                                    <td><span className="badge badge-soft-success">Matched</span></td>
                                                    <td>{new Date(match.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                            {(!detailedAnalytics?.recentMatches || detailedAnalytics.recentMatches.length === 0) && (
                                                <tr><td colSpan={4} className="text-center text-muted py-4">No recent matches found</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer border-top text-center p-3">
                                <a href="/matches" className="link-primary text-decoration-underline fw-medium">View All Matches <i className="ri-arrow-right-up-line"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="footer">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">© 2026 Hookouts Admin. Crafted with ❤️</div>
                        </div>
                    </div>
                </footer>
            </div>
        </Fragment>
    );
};
