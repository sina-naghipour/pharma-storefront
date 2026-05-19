import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PasswordResetService from '../api/PasswordResetService';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (cooldownRemaining <= 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [cooldownRemaining]);

  const startCooldown = (seconds) => {
    setCooldownRemaining(seconds);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCooldownRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('لطفا ایمیل یا نام کاربری خود را وارد کنید');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await PasswordResetService.requestReset(identifier);
      setSuccess(response.message || 'لینک بازیابی رمز عبور به ایمیل شما ارسال شد');
      setIdentifier('');
    } catch (err) {
      if (err.data && err.data.remaining_seconds) {
        const remaining = err.data.remaining_seconds;
        setError(`لطفاً ${remaining} ثانیه دیگر صبر کنید.`);
        startCooldown(remaining);
      } else {
        setError(err.message || 'خطا در ارسال لینک بازیابی');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-12" dir="rtl">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">بازیابی رمز عبور</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              ایمیل یا نام کاربری خود را وارد کنید. لینک بازیابی برای شما ارسال می‌شود.
            </p>
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
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">ایمیل یا نام کاربری</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="ایمیل یا نام کاربری خود را وارد کنید"
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || cooldownRemaining > 0}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'در حال ارسال...' : (cooldownRemaining > 0 ? `صبر کنید (${cooldownRemaining} ثانیه)` : 'ارسال لینک بازیابی')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
              بازگشت به صفحه ورود
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;