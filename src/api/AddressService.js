import apiClient from './client';
import { ENDPOINTS } from './endpoints';

class AddressService {
  // Get all addresses for current user
  async getAddresses() {
    try {
      const response = await apiClient.get(ENDPOINTS.ACCOUNTS.ADDRESSES);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get single address
  async getAddress(id) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.ACCOUNTS.ADDRESSES}${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new address
  async createAddress(addressData) {
    try {
      const response = await apiClient.post(ENDPOINTS.ACCOUNTS.ADDRESSES, addressData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update address
  async updateAddress(id, addressData) {
    try {
      const response = await apiClient.patch(`${ENDPOINTS.ACCOUNTS.ADDRESSES}${id}/`, addressData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete address
  async deleteAddress(id) {
    try {
      await apiClient.delete(`${ENDPOINTS.ACCOUNTS.ADDRESSES}${id}/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Set address as default
  async setDefaultAddress(id, addressType = 'shipping') {
    try {
      const response = await apiClient.post(`${ENDPOINTS.ACCOUNTS.ADDRESSES}${id}/set_default/`, {
        address_type: addressType
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
    return {
      message: 'خطا در اتصال به سرور',
      status: 0,
    };
  }
}

export default new AddressService();