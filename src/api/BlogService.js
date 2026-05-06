import apiClient from './client';
import { ENDPOINTS } from './endpoints';

class BlogService {
  async getPosts(params = {}) {
    try {
      const response = await apiClient.get('/blog/posts/', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPost(slug) {
    try {
      const response = await apiClient.get(`/blog/posts/${slug}/`);
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

export default new BlogService();