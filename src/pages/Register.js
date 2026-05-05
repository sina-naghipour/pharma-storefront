import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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

    if (formData.password !== formData.password_confirm) {
      setError('رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }
    if (!formData.username) {
      setError('نام کاربری الزامی است');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        user_type: 'customer'
      };
      await register(payload);
      navigate('/login');
    } catch (err) {
      if (err.data && typeof err.data === 'object') {
        const errorMessages = Object.values(err.data).flat().join('\n');
        setError(errorMessages || 'خطا در ثبت نام');
      } else {
        setError(err.message || 'خطا در ثبت نام');
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ثبت نام</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">عضو جدید داروخانه آنلاین شوید</p>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6 whitespace-pre-wrap">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">نام کاربری *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-dark-border rounded-xl p-3 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">نام</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-dark-border rounded-xl p-3 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">نام خانوادگی</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-dark-border rounded-xl p-3 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">ایمیل *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-dark-border rounded-xl p-3 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">شماره تلفن</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-dark-border rounded-xl p-3 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">رمز عبور *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-dark-border rounded-xl p-3 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">تکرار رمز عبور *</label>
              <input
                type="password"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-dark-border rounded-xl p-3 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 shadow-md"
            >
              {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              قبلا ثبت نام کرده‌اید؟{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                ورود
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;