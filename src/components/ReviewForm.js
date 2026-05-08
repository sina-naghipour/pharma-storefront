import React, { useState } from 'react';
import RatingStars from './RatingStars';
import ReviewService from '../api/ReviewService';

const ReviewForm = ({ productId, productSlug, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !title || !content) {
      setError('لطفا امتیاز، عنوان و متن نظر را وارد کنید');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await ReviewService.createReview({
        product: productId,
        rating,
        title,
        content,
      });
      setSuccess('نظر شما با موفقیت ثبت شد. پس از تأیید نمایش داده خواهد شد.');
      setTitle('');
      setContent('');
      setRating(5);
      if (onSuccess) onSuccess();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      // Extract error message from backend response
      let errorMessage = 'خطا در ثبت نظر';
      if (err.data) {
        // Check for non_field_errors first
        if (err.data.non_field_errors && err.data.non_field_errors.length) {
          errorMessage = err.data.non_field_errors.join('\n');
        } else if (err.data.product) {
          errorMessage = err.data.product.join('\n');
        } else if (err.data.detail) {
          errorMessage = err.data.detail;
        } else {
          const firstError = Object.values(err.data)[0];
          if (firstError && firstError.length) {
            errorMessage = firstError.join('\n');
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('Review submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-xl font-semibold mb-4">ثبت نظر جدید</h3>
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 whitespace-pre-wrap">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-lg mb-4">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">امتیاز شما</label>
          <RatingStars rating={rating} interactive={true} onRatingChange={setRating} size="large" />
        </div>
        <div>
          <input
            type="text"
            placeholder="عنوان نظر"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-3 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <textarea
            rows="4"
            placeholder="متن نظر خود را بنویسید..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-3 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
          >
            {submitting ? 'در حال ثبت...' : 'ثبت نظر'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;