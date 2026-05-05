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
    <div className="login-page container mx-auto px-4 py-8 max-w-md" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">ورود به حساب کاربری</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 whitespace-pre-wrap">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="mb-4">
            <label className="block mb-2">نام کاربری</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              className="w-full border rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">رمز عبور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full border rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            حساب کاربری ندارید؟{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800">
              ثبت نام
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;