import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import AddressService from '../api/AddressService';
import OrderService from '../api/OrderService';
import { formatPrice } from '../utils/format';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, applyCoupon } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Redirect if not authenticated or cart empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (!cartLoading && (!cart || !cart.items || cart.items.length === 0)) {
      navigate('/cart');
    }
  }, [isAuthenticated, cart, cartLoading, navigate]);

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await AddressService.getAddresses();
        setAddresses(data.results || data);
        const defaultAddress = (data.results || data).find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      } catch (err) {
        setError('خطا در دریافت آدرس‌ها');
      } finally {
        setLoadingAddresses(false);
      }
    };
    if (isAuthenticated) fetchAddresses();
  }, [isAuthenticated]);

  // Check if any product requires prescription
  const requiresPrescription = cart?.items?.some(
    item => item.product_details?.prescription_required === 'required'
  );

  const handleFileChange = (e) => {
    setPrescriptionFile(e.target.files[0]);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('لطفا کد تخفیف را وارد کنید');
      return;
    }
    setApplyingCoupon(true);
    setCouponError('');
    setCouponSuccess('');
    try {
      await applyCoupon({ code: couponCode });
      setCouponSuccess('کد تخفیف با موفقیت اعمال شد');
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message || 'کد تخفیف نامعتبر است');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!selectedAddressId) {
      setError('لطفا یک آدرس را انتخاب کنید');
      setSubmitting(false);
      return;
    }

    const orderData = {
      shipping_address_id: selectedAddressId,
      billing_address_id: selectedAddressId,
      payment_method: paymentMethod,
      use_same_address_for_billing: true,
      customer_notes: '',
    };

    if (requiresPrescription && !cart?.prescription_file && !prescriptionFile) {
      setError('لطفا نسخه پزشکی را بارگذاری کنید');
      setSubmitting(false);
      return;
    }

    try {
      // If prescription file is provided, upload to cart first (you may need to implement this)
      if (prescriptionFile && !cart?.prescription_file) {
        // Example: await CartService.uploadPrescription({ prescription_file: prescriptionFile });
        console.warn('Prescription upload not fully integrated yet');
      }
      const response = await OrderService.createOrder(orderData);
      navigate(`/orders/${response.id}`, { state: { success: 'سفارش شما با موفقیت ثبت شد' } });
    } catch (err) {
      setError(err.message || 'خطا در ثبت سفارش');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading || loadingAddresses) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">در حال بارگذاری...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const subtotal = cart.subtotal || 0;
  const discount = cart.discount_amount || 0;
  const total = cart.total || 0;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">تکمیل سفارش</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address selection */}
            <div className="bg-white dark:bg-dark-surface rounded-xl shadow p-6 border border-gray-100 dark:border-dark-border">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">آدرس تحویل</h2>
              {addresses.length === 0 ? (
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">هیچ آدرسی ثبت نشده است</p>
                  <button type="button" onClick={() => navigate('/profile')} className="text-primary-600 dark:text-primary-400 underline">
                    افزودن آدرس جدید
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <label key={addr.id} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-dark-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-bg">
                      <input
                        type="radio"
                        name="shippingAddress"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">{addr.first_name} {addr.last_name}</div>
                        <div className="text-gray-600 dark:text-gray-400">{addr.address_line_1}</div>
                        {addr.address_line_2 && <div className="text-gray-600 dark:text-gray-400">{addr.address_line_2}</div>}
                        <div className="text-gray-600 dark:text-gray-400">{addr.city}, {addr.state_province}</div>
                        <div className="text-gray-600 dark:text-gray-400">کد پستی: {addr.postal_code}</div>
                        {addr.phone_number && <div className="text-gray-600 dark:text-gray-400">تلفن: {addr.phone_number}</div>}
                      </div>
                    </label>
                  ))}
                  <button type="button" onClick={() => navigate('/profile')} className="text-primary-600 dark:text-primary-400 text-sm mt-2">
                    + افزودن آدرس جدید
                  </button>
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="bg-white dark:bg-dark-surface rounded-xl shadow p-6 border border-gray-100 dark:border-dark-border">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">روش پرداخت</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>پرداخت در محل</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>درگاه پرداخت آنلاین (به زودی)</span>
                </label>
              </div>
            </div>

            {/* Prescription upload */}
            {requiresPrescription && (
              <div className="bg-white dark:bg-dark-surface rounded-xl shadow p-6 border border-gray-100 dark:border-dark-border">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">بارگذاری نسخه پزشکی</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                  برخی محصولات نیاز به نسخه پزشک دارند. لطفاً تصویر نسخه را بارگذاری کنید.
                </p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg"
                />
                {cart?.prescription_file && (
                  <p className="text-green-600 dark:text-green-400 text-sm mt-2">✓ نسخه قبلاً بارگذاری شده است</p>
                )}
              </div>
            )}

            {/* Coupon Section */}
            <div className="bg-white dark:bg-dark-surface rounded-xl shadow p-6 border border-gray-100 dark:border-dark-border">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">کد تخفیف</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="کد تخفیف خود را وارد کنید"
                  className="flex-1 border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  disabled={applyingCoupon}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon || !couponCode.trim()}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {applyingCoupon ? 'در حال بررسی...' : 'اعمال'}
                </button>
              </div>
              {couponError && <p className="text-red-600 text-sm mt-2">{couponError}</p>}
              {couponSuccess && <p className="text-green-600 text-sm mt-2">{couponSuccess}</p>}
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || addresses.length === 0}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
            >
              {submitting ? 'در حال ثبت سفارش...' : 'ثبت سفارش'}
            </button>
          </form>
        </div>

        {/* Order summary with discount display */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 dark:bg-dark-surface rounded-xl p-6 sticky top-20 border border-gray-200 dark:border-dark-border">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">خلاصه سفارش</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>جمع کل:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>تخفیف:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>هزینه ارسال:</span>
                <span>محاسبه در مرحله بعد</span>
              </div>
              <div className="border-t border-gray-200 dark:border-dark-border pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                  <span>قابل پرداخت:</span>
                  <span className="text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;