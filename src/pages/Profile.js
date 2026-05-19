import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthService from '../api/AuthService';
import AddressManager from '../components/AddressManager';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
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
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number
      };
      
      const updatedProfile = await AuthService.updateProfile(updateData);
      setProfile(updatedProfile);
      setEditing(false);
      setSuccess('اطلاعات با موفقیت به‌روزرسانی شد');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'خطا در به‌روزرسانی اطلاعات');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">در حال بارگذاری...</div>;
  }

  return (
    <div className="profile-page container mx-auto px-4 py-8" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* User Profile Card */}
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
                <label className="block mb-2 text-gray-700 dark:text-gray-300">نام</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleChange}
                  className="input-field"
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
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300">ایمیل</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="input-field"
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
                />
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
                <span className="font-semibold text-gray-700 dark:text-gray-300">نام:</span>
                <span className="mr-2 text-gray-900 dark:text-white">{profile?.first_name || '—'}</span>
              </div>
              <div className="border-b border-gray-200 dark:border-dark-border pb-3">
                <span className="font-semibold text-gray-700 dark:text-gray-300">نام خانوادگی:</span>
                <span className="mr-2 text-gray-900 dark:text-white">{profile?.last_name || '—'}</span>
              </div>
              <div className="border-b border-gray-200 dark:border-dark-border pb-3">
                <span className="font-semibold text-gray-700 dark:text-gray-300">ایمیل:</span>
                <span className="mr-2 text-gray-900 dark:text-white">{profile?.email || '—'}</span>
              </div>
              <div className="border-b border-gray-200 dark:border-dark-border pb-3">
                <span className="font-semibold text-gray-700 dark:text-gray-300">شماره تلفن:</span>
                <span className="mr-2 text-gray-900 dark:text-white">{profile?.phone_number || '—'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Address Manager Section – already updated separately */}
        <div className="mt-6">
          <AddressManager />
        </div>

        {/* Logout Button */}
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