import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

class CartService {
  // Get current cart
  async getCurrentCart() {
    try {
      const response = await apiClient.get(ENDPOINTS.ORDERS.CART_CURRENT);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add item to cart
  async addItem(itemData) {
    try {
      const response = await apiClient.post(ENDPOINTS.ORDERS.CART_ADD_ITEM, itemData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update cart item
  async updateItem(itemData) {
    try {
      const response = await apiClient.post(ENDPOINTS.ORDERS.CART_UPDATE_ITEM, itemData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Remove item from cart
  async removeItem(itemData) {
    try {
      const response = await apiClient.post(ENDPOINTS.ORDERS.CART_REMOVE_ITEM, itemData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Clear cart
  async clearCart() {
    try {
      const response = await apiClient.post(ENDPOINTS.ORDERS.CART_CLEAR);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Apply coupon
  async applyCoupon(couponData) {
  try {
      const response = await apiClient.post(ENDPOINTS.ORDERS.CART_APPLY_COUPON, couponData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Set addresses
  async setAddresses(addressData) {
    try {
      const response = await apiClient.post(ENDPOINTS.ORDERS.CART_SET_ADDRESSES, addressData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload prescription
  async uploadPrescription(prescriptionData) {
    try {
      const formData = new FormData();
      Object.keys(prescriptionData).forEach(key => {
        formData.append(key, prescriptionData[key]);
      });

      const response = await apiClient.post(ENDPOINTS.ORDERS.CART_UPLOAD_PRESCRIPTION, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
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

export default new CartService();