import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

class ProductService {
  // Get all products with filters
  async getProducts(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.PRODUCTS, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get single product
  async getProduct(slug) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.PRODUCTS.PRODUCTS}${slug}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get featured products
  async getFeaturedProducts() {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.FEATURED);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get products on sale
  async getOnSaleProducts() {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.ON_SALE);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get product categories
  async getCategories() {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.CATEGORIES);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get root categories
  async getRootCategories() {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.ROOT_CATEGORIES);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get category products
  async getCategoryProducts(slug, params = {}) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.PRODUCTS.CATEGORIES}${slug}/products/`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get manufacturers
  async getManufacturers() {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.MANUFACTURERS);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get manufacturer products
  async getManufacturerProducts(slug, params = {}) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.PRODUCTS.MANUFACTURERS}${slug}/products/`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get product reviews
  async getProductReviews(slug, params = {}) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.PRODUCTS.PRODUCTS}${slug}/reviews/`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add product review
  async addProductReview(slug, reviewData) {
    try {
      const response = await apiClient.post(`${ENDPOINTS.PRODUCTS.PRODUCTS}${slug}/add_review/`, reviewData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get similar products
  async getSimilarProducts(slug) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.PRODUCTS.PRODUCTS}${slug}/similar/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get product variants
  async getProductVariants(slug) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.PRODUCTS.PRODUCTS}${slug}/variants/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get expiring batches
  async getExpiringBatches() {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.EXPIRING_SOON);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search products
  async searchProducts(query, params = {}) {
    try {
      const searchParams = { search: query, ...params };
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.PRODUCTS, { params: searchParams });
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

export default new ProductService();