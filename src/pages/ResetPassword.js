import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PasswordResetService from '../api/PasswordResetService';

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!uid || !token) {
      setError('لینک نامعتبر است');
    }
  }, [uid, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }
    if (newPassword.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await PasswordResetService.resetPassword(uid, token, newPassword, confirmPassword);
      setSuccess('رمز عبور شما با موفقیت تغییر کرد. لطفاً وارد شوید.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'خطا در بازنشانی رمز عبور');
    } finally {
      setLoading(false);
    }
  };

  if (error && !success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-12" dir="rtl">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطا</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link to="/forgot-password" className="text-primary-600 hover:underline">درخواست مجدد بازیابی</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-12" dir="rtl">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">تعیین رمز عبور جدید</h1>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">رمز عبور جدید</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">تکرار رمز عبور جدید</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'در حال بازنشانی...' : 'بازنشانی رمز عبور'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;