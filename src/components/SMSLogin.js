import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

const SMSLogin = () => {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-12" dir="rtl">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {step === 'phone' ? (
            <form onSubmit={requestOTP}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ورود با شماره موبایل</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">کد تایید به شماره شما ارسال می‌شود</p>
              </div>

              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="mb-6">
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

              <div className="mt-6 text-center">
                <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
                  ورود با رمز عبور
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={verifyOTP}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">کد تایید</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  کد ۶ رقمی به شماره {phone} ارسال شد
                </p>
              </div>

              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="mb-6">
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

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  تغییر شماره موبایل
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SMSLogin;