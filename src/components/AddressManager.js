import React, { useState, useEffect } from 'react';
import AddressService from '../api/AddressService';

// List of Iran provinces
const IRAN_PROVINCES = [
  'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام',
  'بوشهر', 'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی',
  'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان', 'سیستان و بلوچستان', 'فارس',
  'قزوین', 'قم', 'کردستان', 'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد',
  'گلستان', 'گیلان', 'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد'
];

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    address_type: 'shipping',
    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state_province: '',
    postal_code: '',
    phone_number: '',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await AddressService.getAddresses();
      setAddresses(data.results || data);
    } catch (err) {
      setError('خطا در دریافت آدرس‌ها');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      address_type: 'shipping',
      first_name: '',
      last_name: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state_province: '',
      postal_code: '',
      phone_number: '',
      is_default: false
    });
    setEditingId(null);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.first_name || !formData.last_name || !formData.address_line_1 ||
        !formData.city || !formData.state_province || !formData.postal_code) {
      setError('لطفا تمام فیلدهای ضروری را پر کنید');
      return;
    }

    try {
      if (editingId) {
        await AddressService.updateAddress(editingId, formData);
        setSuccess('آدرس با موفقیت ویرایش شد');
      } else {
        await AddressService.createAddress(formData);
        setSuccess('آدرس جدید با موفقیت اضافه شد');
      }
      resetForm();
      setShowForm(false);
      fetchAddresses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'خطا در ذخیره آدرس');
    }
  };

  const handleEdit = (address) => {
    setFormData({
      address_type: address.address_type,
      first_name: address.first_name,
      last_name: address.last_name,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      city: address.city,
      state_province: address.state_province,
      postal_code: address.postal_code,
      phone_number: address.phone_number || '',
      is_default: address.is_default
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این آدرس مطمئن هستید؟')) {
      try {
        await AddressService.deleteAddress(id);
        setSuccess('آدرس حذف شد');
        fetchAddresses();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('خطا در حذف آدرس');
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await AddressService.setDefaultAddress(id, 'shipping');
      setSuccess('آدرس پیش‌فرض با موفقیت تنظیم شد');
      fetchAddresses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('خطا در تنظیم آدرس پیش‌فرض');
    }
  };

  if (loading) return <div className="text-center py-4 text-gray-600 dark:text-gray-400">در حال بارگذاری آدرس‌ها...</div>;

  return (
    <div className="address-manager mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">آدرس‌های من</h2>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            + افزودن آدرس جدید
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

      {/* Address Form */}
      {showForm && (
        <div className="bg-gray-50 dark:bg-dark-surface rounded-xl p-6 mb-6 border border-gray-200 dark:border-dark-border">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {editingId ? 'ویرایش آدرس' : 'آدرس جدید'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">نام *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">نام خانوادگی *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">آدرس (خط اول) *</label>
              <input
                type="text"
                name="address_line_1"
                value={formData.address_line_1}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">آدرس (خط دوم - اختیاری)</label>
              <input
                type="text"
                name="address_line_2"
                value={formData.address_line_2}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">استان *</label>
                <select
                  name="state_province"
                  value={formData.state_province}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  required
                >
                  <option value="">انتخاب استان</option>
                  {IRAN_PROVINCES.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">شهر *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">کد پستی *</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">شماره تلفن</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>آدرس پیش‌فرض باشد</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                {editingId ? 'به‌روزرسانی' : 'ذخیره'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showForm ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">هیچ آدرسی ثبت نشده است</div>
      ) : (
        <div className="space-y-4">
          {addresses.map(address => (
            <div key={address.id} className="border border-gray-200 dark:border-dark-border rounded-xl p-4 bg-white dark:bg-dark-surface">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-900 dark:text-white">
                    {address.first_name} {address.last_name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mt-1">{address.address_line_1}</div>
                  {address.address_line_2 && <div className="text-gray-600 dark:text-gray-400">{address.address_line_2}</div>}
                  <div className="text-gray-600 dark:text-gray-400">{address.city}, {address.state_province}</div>
                  <div className="text-gray-600 dark:text-gray-400">کد پستی: {address.postal_code}</div>
                  {address.phone_number && <div className="text-gray-600 dark:text-gray-400">تلفن: {address.phone_number}</div>}
                  {address.is_default && (
                    <span className="inline-block mt-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                      پیش‌فرض
                    </span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm"
                    >
                      تنظیم به عنوان پیش‌فرض
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressManager;