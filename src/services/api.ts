import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/admin';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth and redirect to login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminTokenExpiry');
      localStorage.removeItem('adminUser');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalMatches: number;
  activeChats: number;
  premiumSubscribers: number;
  revenue: number;
}

export interface DetailedAnalytics {
  // Engagement
  totalLikes: number;
  likesToday: number;
  superLikes: number;
  totalMessages: number;
  messagesToday: number;
  
  // Safety
  blocksCount: number;
  
  // User Stats
  onlineUsers: number;
  
  // Demographics
  genderDistribution: any;
  authProviders: any;
  ageDistribution: any;
  topLocations: { city: string; count: number }[];
  
  // Profile Stats
  profilesTotal: number;
  profilesCompleted: number;
  avgCompletionPercent: number;
  usersWithPhotos: number;
  usersWithBio: number;
  
  // Subscriptions
  premiumUsers: number;
  subscriptionTiers: any;
  expiringSubscriptions: number;
  
  // Activity
  dau: number; // Daily Active Users
  mau: number; // Monthly Active Users
  totalMatches: number;
  matchRate: number;
  
  // Recent Data
  recentMatches: any[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  rating?: number;
  createdAt?: string;
  isActive?: boolean;
}

export interface AnalyticsData {
  period: string;
  userGrowth: number[];
  activityData: number[];
  topLocations: { name: string; count: number }[];
  genderDistribution: { male: number; female: number; other: number };
  ageDistribution: Record<string, number>;
}

export interface UserGrowthData {
  date: string;
  count: number;
}

export interface DailyActivityData {
  date: string;
  likes: number;
  messages: number;
  matches: number;
  total: number;
}

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/stats');
    return response.data.data;
  },

  getAnalytics: async (period: string = '7d'): Promise<AnalyticsData> => {
    try {
      const [userGrowthResponse, activityResponse, detailedResponse] = await Promise.all([
        api.get('/analytics/user-growth'),
        api.get('/analytics/daily-activity'),
        api.get('/analytics/detailed')
      ]);

      const userGrowthData: UserGrowthData[] = userGrowthResponse.data.data;
      const activityData: DailyActivityData[] = activityResponse.data.data;
      const detailed = detailedResponse.data.data;

      return {
        period,
        userGrowth: userGrowthData.map(d => d.count),
        activityData: activityData.map(d => d.total),
        topLocations: detailed.topLocations?.map((loc: any) => ({
          name: loc.city,
          count: loc.count
        })) || [],
        genderDistribution: {
          male: detailed.genderDistribution?.MALE || 0,
          female: detailed.genderDistribution?.FEMALE || 0,
          other: detailed.genderDistribution?.OTHER || 0
        },
        ageDistribution: detailed.ageDistribution || {}
      };
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Fallback to empty data
      return {
        period,
        userGrowth: [],
        activityData: [],
        topLocations: [],
        genderDistribution: { male: 0, female: 0, other: 0 },
        ageDistribution: {}
      };
    }
  },
  
  getDetailedAnalytics: async (): Promise<DetailedAnalytics> => {
    const response = await api.get('/analytics/detailed');
    return response.data.data;
  },
};

export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    // Note: This would need a new backend endpoint for all users
    // For now, using recent users as a substitute
    const response = await api.get('/users/recent', { params: { limit: 100 } });
    return response.data.data.users || [];
  },

  getRecent: async (limit: number = 10): Promise<User[]> => {
    const response = await api.get('/users/recent', { params: { limit } });
    return response.data.data.users || [];
  },

  getById: async (id: string): Promise<any> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  update: async (userId: string, data: any): Promise<any> => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  delete: async (userId: string): Promise<any> => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  block: async (userId: string): Promise<any> => {
    // Use existing account endpoint
    const response = await axios.post('http://localhost:5000/api/v1/account/block', { userId });
    return response.data;
  },
};
