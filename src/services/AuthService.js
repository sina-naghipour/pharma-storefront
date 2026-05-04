import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

class AuthService {
  // Login user
  async login(credentials) {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
      const { access, refresh, user } = response.data;
      
      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout user
  async logout() {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await apiClient.post(ENDPOINTS.ACCOUNTS.USERS, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiClient.get(ENDPOINTS.ACCOUNTS.USER_ME);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post(ENDPOINTS.ACCOUNTS.CHANGE_PASSWORD, passwordData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Password reset
  async passwordReset(email) {
    try {
      const response = await apiClient.post(ENDPOINTS.ACCOUNTS.PASSWORD_RESET, { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Password reset confirm
  async passwordResetConfirm(resetData) {
    try {
      const response = await apiClient.post(ENDPOINTS.ACCOUNTS.PASSWORD_RESET_CONFIRM, resetData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  // Get stored user
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Handle API errors
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