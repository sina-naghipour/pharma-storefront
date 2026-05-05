import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      if (err.data && typeof err.data === 'object') {
        const errorMessages = Object.values(err.data).flat().join('\n');
        setError(errorMessages || 'خطا در ورود به سیستم');
      } else {
        setError(err.message || 'خطا در ورود به سیستم');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-12" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-dark-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ورود به حساب کاربری</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">به داروخانه آنلاین خوش آمدید</p>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6 whitespace-pre-wrap">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="on">
            <div className="mb-5">
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">نام کاربری</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                className="w-full border border-gray-300 dark:border-dark-border rounded-xl p-3 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">رمز عبور</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full border border-gray-300 dark:border-dark-border rounded-xl p-3 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              حساب کاربری ندارید؟{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                ثبت نام
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;