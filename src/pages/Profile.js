import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthService from '../api/AuthService';
import AddressManager from '../components/AddressManager';
import apiClient from '../api/client';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');
  const returnTo = location.state?.returnTo || null;

  // Password change states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordStep, setPasswordStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpRequestLoading, setOtpRequestLoading] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
    if (user?.phone_number) setPhone(user.phone_number);
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await AuthService.getCurrentUser();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    
    try {
      const updateData = {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number
      };
      
      const updatedProfile = await AuthService.updateProfile(updateData);
      setProfile(updatedProfile);
      refreshUser();
      setEditing(false);
      setSuccess('اطلاعات با موفقیت به‌روزرسانی شد');
      
      if (returnTo === '/checkout') {
        setTimeout(() => navigate('/checkout'), 1500);
      } else {
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError(error.message || 'خطا در به‌روزرسانی 정보');
    } finally {
      setSaving(false);
    }
  };

  // Password change handlers
  const requestPasswordOTP = async () => {
    if (!phone.match(/^09[0-9]{9}$/)) {
      setError('شماره موبایل نامعتبر است');
      return;
    }
    setOtpRequestLoading(true);
    setError('');
    try {
      await apiClient.post('/accounts/auth/request-otp/', { phone_number: phone });
      setPasswordStep('otp');
      setSuccess('کد تایید به شماره شما ارسال شد');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'ارسال کد تایید با خطا مواجه شد');
    } finally {
      setOtpRequestLoading(false);
    }
  };

  const verifyPasswordOTP = async () => {
    if (!otp.match(/^\d{6}$/)) {
      setError('کد تایید باید ۶ رقم باشد');
      return;
    }
    setPasswordSubmitting(true);
    setError('');
    try {
      setPasswordStep('set');
      setSuccess('کد تأیید شد. لطفاً رمز عبور جدید را وارد کنید.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'خطا در تأیید کد');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const submitNewPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }
    if (newPassword.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    setPasswordSubmitting(true);
    setError('');
    try {
      await apiClient.post('/accounts/auth/set_password_with_otp/', {
        phone_number: phone,
        code: otp,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      setSuccess('رمز عبور با موفقیت تغییر کرد');
      setShowPasswordForm(false);
      setPasswordStep('phone');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'خطا در تغییر رمز عبور');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const cancelPasswordChange = () => {
    setShowPasswordForm(false);
    setPasswordStep('phone');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const isPlaceholderEmail = (email) => email && email.endsWith('@placeholder.com');
  const getDisplayEmail = (email) => (!email || isPlaceholderEmail(email)) ? '—' : email;
  const getEditEmail = (email) => (isPlaceholderEmail(email) ? '' : email || '');

  if (loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">در حال بارگذاری...</div>;
  }

  return (
    <div className="profile-page container mx-auto px-4 py-8" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {message && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        <div className="card p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">پروفایل کاربری</h1>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn-primary !py-2 !px-4 text-sm"
              >
                ویرایش پروفایل
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300">نام کاربری</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ''}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300">نام</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300">نام خانوادگی</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300">ایمیل</label>
                <input
                  type="email"
                  name="email"
                  value={getEditEmail(formData.email)}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-gray-700 dark:text-gray-300">شماره تلفن</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number || ''}
                  onChange={handleChange}
                  className="input-field"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">شماره تلفن قابل ویرایش نیست</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary disabled:opacity-50"
                >
                  {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn-secondary"
                >
                  انصراف
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="border-b border-gray-200 dark:border-dark-border pb-3">
                <span className="font-semibold text-gray-700 dark:text-gray-300">نام کاربری:</span>
                <span className="mr-2 text-gray-900 dark:text-white">{profile?.username || '—'}</span>
              </div>
              <div className="border-b border-gray-200 dark:border-dark-border pb-3">
                <span className="font-semibold text-gray-700 dark:text-gray-300">نام:</span>
                <span className="mr-2 text-gray-900 dark:text-white">{profile?.first_name || '—'}</span>
              </div>
              <div className="border-b border-gray-200 dark:border-dark-border pb-3">
                <span className="font-semibold text-gray-700 dark:text-gray-300">نام خانوادگی:</span>
                <span className="mr-2 text-gray-900 dark:text-white">{profile?.last_name || '—'}</span>
              </div>
              <div className="border-b border-gray-200 dark:border-dark-border pb-3">
                <span className="font-semibold text-gray-700 dark:text-gray-300">ایمیل:</span>
                <span className="mr-2 text-gray-900 dark:text-white">{getDisplayEmail(profile?.email)}</span>
              </div>
              <div className="border-b border-gray-200 dark:border-dark-border pb-3">
                <span className="font-semibold text-gray-700 dark:text-gray-300">شماره تلفن:</span>
                <span className="mr-2 text-gray-900 dark:text-white">{profile?.phone_number || '—'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Password Change Section */}
        <div className="card p-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">تغییر رمز عبور</h2>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="btn-secondary !py-2 !px-4 text-sm"
              >
                تغییر رمز عبور
              </button>
            )}
          </div>
          {showPasswordForm && (
            <div className="mt-4 p-4 border border-gray-200 dark:border-dark-border rounded-lg">
              {passwordStep === 'phone' && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    کد تأیید به شماره موبایل شما ارسال خواهد شد.
                  </p>
                  <div className="mb-3">
                    <label className="block mb-1 text-gray-700 dark:text-gray-300">شماره موبایل</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field"
                      placeholder="09xxxxxxxxx"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={requestPasswordOTP}
                      disabled={otpRequestLoading}
                      className="btn-primary !py-2 !px-4 text-sm"
                    >
                      {otpRequestLoading ? 'در حال ارسال...' : 'ارسال کد تایید'}
                    </button>
                    <button onClick={cancelPasswordChange} className="btn-secondary !py-2 !px-4 text-sm">
                      انصراف
                    </button>
                  </div>
                </div>
              )}
              {passwordStep === 'otp' && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    کد ۶ رقمی به شماره {phone} ارسال شد. آن را وارد کنید.
                  </p>
                  <div className="mb-3">
                    <label className="block mb-1 text-gray-700 dark:text-gray-300">کد تایید</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="input-field"
                      placeholder="123456"
                      maxLength="6"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={verifyPasswordOTP}
                      disabled={passwordSubmitting}
                      className="btn-primary !py-2 !px-4 text-sm"
                    >
                      تأیید کد
                    </button>
                    <button onClick={cancelPasswordChange} className="btn-secondary !py-2 !px-4 text-sm">
                      انصراف
                    </button>
                  </div>
                </div>
              )}
              {passwordStep === 'set' && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    رمز عبور جدید خود را وارد کنید.
                  </p>
                  <div className="mb-3">
                    <label className="block mb-1 text-gray-700 dark:text-gray-300">رمز عبور جدید</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field"
                      placeholder="حداقل ۶ کاراکتر"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1 text-gray-700 dark:text-gray-300">تکرار رمز عبور جدید</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field"
                      placeholder="تکرار رمز عبور"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={submitNewPassword}
                      disabled={passwordSubmitting}
                      className="btn-primary !py-2 !px-4 text-sm"
                    >
                      {passwordSubmitting ? 'در حال ثبت...' : 'ثبت رمز عبور'}
                    </button>
                    <button onClick={cancelPasswordChange} className="btn-secondary !py-2 !px-4 text-sm">
                      انصراف
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6">
          <AddressManager />
        </div>

        <div className="mt-6">
          <button
            onClick={logout}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            خروج از حساب کاربری
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;