import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

class OrderService {
  // Get all orders
  async getOrders(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.ORDERS.ORDERS, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get single order
  async getOrder(id) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.ORDERS.ORDERS}${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create order
  async createOrder(orderData) {
    try {
      const response = await apiClient.post(ENDPOINTS.ORDERS.ORDERS, orderData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Cancel order
  async cancelOrder(id, cancelData = {}) {
    try {
      const response = await apiClient.post(`${ENDPOINTS.ORDERS.ORDERS}${id}/cancel/`, cancelData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get order payments
  async getOrderPayments(id) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.ORDERS.ORDERS}${id}/payments/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get order refunds
  async getOrderRefunds(id) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.ORDERS.ORDERS}${id}/refunds/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get order shipments
  async getOrderShipments(id) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.ORDERS.ORDERS}${id}/shipments/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Track order
  async trackOrder(trackingNumber) {
    try {
      const response = await apiClient.get(ENDPOINTS.ORDERS.ORDERS, {
        params: { tracking_number: trackingNumber }
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

export default new OrderService();