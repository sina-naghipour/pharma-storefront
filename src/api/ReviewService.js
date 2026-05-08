import apiClient from './client';

class ReviewService {
  // Get reviews for a product
  async getProductReviews(params) {
    try {
      const response = await apiClient.get('/products/reviews/', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get a single review by ID (includes comments)
  async getReview(reviewId) {
    try {
      const response = await apiClient.get(`/reviews/reviews/${reviewId}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Submit a review
  async createReview(reviewData) {
    try {
      const response = await apiClient.post(`/reviews/reviews/`, reviewData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Vote on a review helpful/unhelpful
  async voteReview(reviewId, vote) {
    try {
      const response = await apiClient.post(`/reviews/reviews/${reviewId}/vote/`, { vote });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add a comment to a review
  async addComment(reviewId, content) {
    try {
      const response = await apiClient.post(`/reviews/reviews/${reviewId}/add_comment/`, { content });
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

export default new ReviewService();