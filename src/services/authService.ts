import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

class AuthService {
  /**
   * Login admin user
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_BASE_URL}/admin/auth/login`, {
      email,
      password,
    });
    
    if (response.data.success) {
      // Store token with expiry timestamp
      const token = response.data.data.token;
      const expiryTime = Date.now() + 30 * 60 * 1000; // 30 minutes from now
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminTokenExpiry', expiryTime.toString());
      localStorage.setItem('adminUser', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  }

  /**
   * Logout admin user
   */
  async logout(): Promise<void> {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      await axios.post(
        `${API_BASE_URL}/admin/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminTokenExpiry');
      localStorage.removeItem('adminUser');
    }
  }

  /**
   * Get current admin user info
   */
  async getMe(): Promise<AdminUser> {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await axios.get(`${API_BASE_URL}/admin/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('adminToken');
    const expiryTime = localStorage.getItem('adminTokenExpiry');
    
    if (!token || !expiryTime) {
      return false;
    }
    
    // Check if token has expired
    const now = Date.now();
    const expiry = parseInt(expiryTime, 10);
    
    if (now >= expiry) {
      // Token has expired, clear storage
      this.clearAuth();
      return false;
    }
    
    return true;
  }
  
  /**
   * Clear authentication data
   */
  clearAuth(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
    localStorage.removeItem('adminUser');
  }

  /**
   * Get stored admin user
   */
  getStoredUser(): AdminUser | null {
    const userStr = localStorage.getItem('adminUser');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }
}

export const authService = new AuthService();
