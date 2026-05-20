import React, { useState, useEffect } from 'react';
import ReviewService from '../api/ReviewService';

const ReviewComments = ({ reviewId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (e) {}
    }
    fetchComments();
  }, [reviewId]);

  const fetchComments = async () => {
    try {
      const data = await ReviewService.getReview(reviewId);
      setComments(data.comments || []);
    } catch (err) {
      setError('خطا در بارگذاری نظرات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await ReviewService.addComment(reviewId, newComment);
      setNewComment('');
      setShowForm(false);
      await fetchComments();
    } catch (err) {
      setError(err.message || 'خطا در ارسال نظر');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-right text-xs text-gray-400 dark:text-gray-500 mt-2">...</div>;

  return (
    <div className="mt-3 pt-2 border-t border-gray-100 dark:border-dark-border">
      <div className="space-y-2">
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-50 dark:bg-dark-surface p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold text-sm text-gray-800 dark:text-white">
                  {comment.user_display_name}
                </span>
                {comment.is_staff_response && (
                  <span className="mr-2 text-xs bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">
                    پاسخ کارشناس
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(comment.created_at).toLocaleDateString('fa-IR')}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="text-primary-600 dark:text-primary-400 text-xs mt-2 hover:underline focus:outline-none transition"
        >
          + پاسخ
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mt-2 space-y-2">
          <textarea
            rows="2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="نظر خود را بنویسید..."
            className="input-field text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-md text-sm transition disabled:opacity-50"
            >
              {submitting ? 'در حال ارسال...' : 'ارسال'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm transition"
            >
              انصراف
            </button>
          </div>
        </form>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ReviewComments;