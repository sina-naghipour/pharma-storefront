import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthService from '../api/AuthService';

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
      // Prepare data to send (only editable fields)
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number  // note: field name is phone_number, not phone
      };
      
      const updatedProfile = await AuthService.updateProfile(updateData);
      setProfile(updatedProfile);
      setEditing(false);
      setSuccess('اطلاعات با موفقیت به‌روزرسانی شد');
      
      // Optionally update the user in auth context
      // The useAuth hook might also need to update, but localStorage is updated in AuthService
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'خطا در به‌روزرسانی اطلاعات');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="profile-page container mx-auto px-4 py-8" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">پروفایل کاربری</h1>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                ویرایش پروفایل
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">نام</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">نام خانوادگی</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">ایمیل</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2">شماره تلفن</label>
                <input
                  type="tel"
                  name="phone_number"   // ← change from 'phone' to 'phone_number'
                  value={formData.phone_number || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                  {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  انصراف
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="border-b pb-3">
                <span className="font-semibold">نام:</span>
                <span className="mr-2">{profile?.first_name || '—'}</span>
              </div>
              <div className="border-b pb-3">
                <span className="font-semibold">نام خانوادگی:</span>
                <span className="mr-2">{profile?.last_name || '—'}</span>
              </div>
              <div className="border-b pb-3">
                <span className="font-semibold">ایمیل:</span>
                <span className="mr-2">{profile?.email || '—'}</span>
              </div>
              <div className="border-b pb-3">
                <span className="font-semibold">شماره تلفن:</span>
                <span className="mr-2">{profile?.phone_number || '—'}</span>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
            >
              خروج از حساب کاربری
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;