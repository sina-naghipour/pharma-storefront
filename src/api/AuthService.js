import apiClient from './client';
import { ENDPOINTS } from './endpoints';

class AuthService {
  async login(credentials) {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
      // JWT response: { access, refresh }
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Fetch user info using the access token
      const user = await this.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));

      return { user, access, refresh };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      // Optional: call a logout endpoint if you have one (blacklist refresh token)
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  async register(userData) {
    try {
      const response = await apiClient.post(ENDPOINTS.ACCOUNTS.USERS, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiClient.get(ENDPOINTS.ACCOUNTS.USER_ME);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    // Optional: check token expiry (simple check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  async updateProfile(userData) {
    try {
      // Use the update_profile endpoint instead of user_me
      const response = await apiClient.patch(ENDPOINTS.ACCOUNTS.UPDATE_PROFILE, userData);
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || 'خطایی رخ داده است',
        status: error.response.status,
        data: error.response.data,
      };
    }
    return {
      message: 'خطا در اتصال به سرور',
      status: 0,
    };
  }
}

export default new AuthService();