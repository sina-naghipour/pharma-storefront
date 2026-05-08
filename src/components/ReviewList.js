import React, { useState, useEffect } from 'react';
import ReviewService from '../api/ReviewService';
import RatingStars from './RatingStars';
import ReviewComments from './ReviewComments';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReviews = async (pageNum = 1) => {
    if (!productId) return;
    setLoading(true);
    try {
      const params = { page: pageNum, product: productId };
      const data = await ReviewService.getProductReviews(params);
      setReviews(data.results || data);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setTotalCount(data.count);
      setPage(pageNum);
    } catch (err) {
      setError('خطا در بارگذاری نظرات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleVote = async (reviewId, vote) => {
    try {
      await ReviewService.voteReview(reviewId, vote);
      fetchReviews(page);
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  if (loading) return <div className="text-center py-4">در حال بارگذاری نظرات...</div>;
  if (error) return <div className="text-center py-4 text-red-600">{error}</div>;
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهید!
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">نظرات کاربران ({totalCount})</h3>
      </div>
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="border-b pb-4 last:border-0">
            <div className="flex justify-between items-start">
              <div>
                <RatingStars rating={review.rating} size="small" />
                <h4 className="font-semibold mt-1">{review.title}</h4>
              </div>
              <div className="text-sm text-gray-500">
                {review.user_display_name} • {new Date(review.created_at).toLocaleDateString('fa-IR')}
              </div>
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{review.content}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <button
                onClick={() => handleVote(review.id, 'helpful')}
                className="flex items-center gap-1 text-green-600 hover:text-green-800"
              >
                👍 {review.helpful_votes}
              </button>
              <button
                onClick={() => handleVote(review.id, 'unhelpful')}
                className="flex items-center gap-1 text-red-600 hover:text-red-800"
              >
                👎 {review.unhelpful_votes}
              </button>
            </div>
            <ReviewComments reviewId={review.id} />
          </div>
        ))}
      </div>
      {(nextPage || prevPage) && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => fetchReviews(page - 1)} disabled={!prevPage} className="px-3 py-1 border rounded disabled:opacity-50">قبلی</button>
          <span className="px-3 py-1">صفحه {page}</span>
          <button onClick={() => fetchReviews(page + 1)} disabled={!nextPage} className="px-3 py-1 border rounded disabled:opacity-50">بعدی</button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;