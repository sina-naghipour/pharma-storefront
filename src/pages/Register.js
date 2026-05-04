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

    // Client-side validation
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
      // Prepare payload matching backend expected fields
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        user_type: 'customer'  // optional, default is customer
      };
      await register(payload);
      navigate('/login');
    } catch (err) {
      // Display detailed validation errors from backend
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
    <div className="register-page container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">ثبت نام</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 whitespace-pre-wrap">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">نام کاربری *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">نام</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">نام خانوادگی</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">ایمیل *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">شماره تلفن</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">رمز عبور *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">تکرار رمز عبور *</label>
            <input
              type="password"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            قبلا ثبت نام کرده‌اید؟{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              ورود
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;