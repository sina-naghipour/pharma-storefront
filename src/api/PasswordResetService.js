import apiClient from './client';
import { ENDPOINTS } from './endpoints';

class PasswordResetService {
  // Request password reset (send email)
  async requestReset(identifier) {
    try {
      // identifier can be email or username
      const response = await apiClient.post(ENDPOINTS.ACCOUNTS.PASSWORD_RESET, { email: identifier });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Confirm password reset (set new password)
  async resetPassword(uid, token, newPassword, confirmPassword) {
    try {
      const response = await apiClient.post(ENDPOINTS.ACCOUNTS.PASSWORD_RESET_CONFIRM, {
        uid,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      return response.data;
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
    return { message: 'خطا در اتصال به سرور', status: 0 };
  }
}

export default new PasswordResetService();