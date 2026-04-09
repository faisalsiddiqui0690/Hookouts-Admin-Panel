import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/admin';

interface AppSettings {
    siteName: string;
    supportEmail: string;
    maxMatchesPerDay: number;
    likeExpirationHours: number;
    matchExpirationDays: number;
    enableNotifications: boolean;
    maintenanceMode: boolean;
}

export default function Settings() {
    const [settings, setSettings] = useState<AppSettings>({
        siteName: 'Hookouts',
        supportEmail: 'support@hookouts.com',
        maxMatchesPerDay: 10,
        likeExpirationHours: 24,
        matchExpirationDays: 7,
        enableNotifications: true,
        maintenanceMode: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${API_BASE_URL}/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.data) {
                setSettings(response.data.data);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage('');
            const token = localStorage.getItem('adminToken');
            await axios.put(`${API_BASE_URL}/settings`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Settings updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update settings:', error);
            setMessage('Failed to update settings.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof AppSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="page-content" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <div className="container-fluid">
                {/* Page Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Settings</h2>
                </div>

                {message && (
                    <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                        {message}
                        <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        {/* General Settings */}
                        <div className="col-xl-6 col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">General Settings</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label className="form-label">Site Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={settings.siteName}
                                            onChange={(e) => handleChange('siteName', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Support Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={settings.supportEmail}
                                            onChange={(e) => handleChange('supportEmail', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Max Matches Per Day</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={settings.maxMatchesPerDay}
                                            onChange={(e) => handleChange('maxMatchesPerDay', parseInt(e.target.value))}
                                            min="1"
                                            required
                                        />
                                        <small className="text-muted">Maximum number of matches a user can get per day</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expiration Settings */}
                        <div className="col-xl-6 col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Expiration Settings</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label className="form-label">Like Expiration (Hours)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={settings.likeExpirationHours}
                                            onChange={(e) => handleChange('likeExpirationHours', parseInt(e.target.value))}
                                            min="1"
                                            required
                                        />
                                        <small className="text-muted">How long likes remain active</small>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Match Expiration (Days)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={settings.matchExpirationDays}
                                            onChange={(e) => handleChange('matchExpirationDays', parseInt(e.target.value))}
                                            min="1"
                                            required
                                        />
                                        <small className="text-muted">How long matches remain active</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature Toggles */}
                        <div className="col-xl-6 col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Feature Toggles</h5>
                                </div>
                                <div className="card-body">
                                    <div className="form-check form-switch mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="enableNotifications"
                                            checked={settings.enableNotifications}
                                            onChange={(e) => handleChange('enableNotifications', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="enableNotifications">
                                            Enable Email Notifications
                                        </label>
                                        <p className="text-muted small mt-1">Send email notifications for matches and messages</p>
                                    </div>

                                    <div className="form-check form-switch mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="maintenanceMode"
                                            checked={settings.maintenanceMode}
                                            onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="maintenanceMode">
                                            Maintenance Mode
                                        </label>
                                        <p className="text-muted small mt-1">Disable user access during maintenance</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Settings'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
