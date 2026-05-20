import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/client';

const Login = () => {
  const [method, setMethod] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const requestOTP = async (e) => {
    e.preventDefault();
    if (!phone.match(/^09[0-9]{9}$/)) {
      setError('شماره موبایل نامعتبر است');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/accounts/auth/request-otp/', { phone_number: phone });
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.error || 'ارسال کد تایید با خطا مواجه شد');
    } finally {
      setLoading(false);
    }
  };


  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/accounts/auth/verify-otp/', {
        phone_number: phone,
        code: otp,
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to home page (not reload the login page)
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'کد تایید نامعتبر است');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitPassword = async (e) => {
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

  const switchMethod = (newMethod) => {
    setMethod(newMethod);
    setError('');
    setStep('phone');
    setPhone('');
    setOtp('');
    setFormData({ username: '', password: '' });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-12" dir="rtl">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-dark-border">
            <button
              onClick={() => switchMethod('phone')}
              className={`flex-1 pb-2 text-center font-medium transition ${
                method === 'phone'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ورود با شماره موبایل
            </button>
            <button
              onClick={() => switchMethod('password')}
              className={`flex-1 pb-2 text-center font-medium transition ${
                method === 'password'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ورود با نام کاربری
            </button>
          </div>

          {method === 'phone' ? (
            step === 'phone' ? (
              <form onSubmit={requestOTP}>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">ورود با شماره موبایل</h2>
                  <p className="text-gray-500 text-sm mt-1">کد تایید برای شما ارسال می‌شود</p>
                </div>

                {error && (
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <div className="mb-5">
                  <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">شماره موبایل</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xxxxxxxxx"
                    className="input-field"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOTP}>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">کد تایید</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    کد ۶ رقمی به شماره {phone} ارسال شد
                  </p>
                </div>

                {error && (
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <div className="mb-5">
                  <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">کد تایید</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="input-field"
                    required
                    maxLength="6"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? 'در حال بررسی...' : 'ورود'}
                </button>

                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    تغییر شماره موبایل
                  </button>
                </div>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmitPassword} autoComplete="on">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">ورود با نام کاربری</h2>
                <p className="text-gray-500 text-sm mt-1">نام کاربری و رمز عبور خود را وارد کنید</p>
              </div>

              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 whitespace-pre-wrap">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">نام کاربری</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  className="input-field"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">رمز عبور</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="input-field"
                />
              </div>

              <div className="text-left mb-4">
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">
                  رمز عبور خود را فراموش کرده‌اید؟
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'در حال ورود...' : 'ورود'}
              </button>
            </form>
          )}

          {method === 'password' && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                حساب کاربری ندارید؟{' '}
                <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  ثبت نام
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;