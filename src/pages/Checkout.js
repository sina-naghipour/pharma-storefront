import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import AddressService from '../api/AddressService';
import OrderService from '../api/OrderService';
import { formatPrice } from '../utils/format';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await AddressService.getAddresses();
      setAddresses(data.results || data);
      if (data.results?.length > 0) {
        const defaultAddress = data.results.find(addr => addr.is_default);
        setSelectedAddressId(defaultAddress?.id || data.results[0].id);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('خطا در دریافت آدرس‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddressId) {
      setError('لطفا آدرس تحویل را انتخاب کنید');
      return;
    }
    if (!cart?.items?.length) {
      setError('سبد خرید خالی است');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const orderData = {
        shipping_address_id: selectedAddressId,
        payment_method: paymentMethod,
        notes: notes,
      };
      const order = await OrderService.createOrder(orderData);
      // Clear cart after successful order creation
      await clearCart();
      // Redirect to payment page or order confirmation
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err.message || 'خطا در ثبت سفارش');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading || loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">در حال بارگذاری...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">سبد خرید خالی است</h1>
        <Link to="/products" className="btn-primary inline-block">مشاهده محصولات</Link>
      </div>
    );
  }

  const total = cart.total || 0;
  const subtotal = cart.subtotal || 0;
  const discount = cart.discount_amount || 0;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">تکمیل خرید</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit}>
            {/* Address Selection */}
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">آدرس تحویل</h2>
              {addresses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 dark:text-gray-400 mb-3">هیچ آدرسی ثبت نشده است</p>
                  <Link to="/profile" className="btn-secondary inline-block">افزودن آدرس جدید</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label key={address.id} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition cursor-pointer">
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 dark:text-white">
                          {address.first_name} {address.last_name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{address.address_line_1}</div>
                        {address.address_line_2 && <div className="text-sm text-gray-600 dark:text-gray-400">{address.address_line_2}</div>}
                        <div className="text-sm text-gray-600 dark:text-gray-400">{address.city}, {address.state_province}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">کد پستی: {address.postal_code}</div>
                        {address.phone_number && <div className="text-sm text-gray-600 dark:text-gray-400">تلفن: {address.phone_number}</div>}
                        {address.is_default && (
                          <span className="inline-block mt-1 text-xs text-primary-600 dark:text-primary-400">پیش‌فرض</span>
                        )}
                      </div>
                    </label>
                  ))}
                  <Link to="/profile" className="text-primary-600 dark:text-primary-400 text-sm hover:underline inline-block mt-2">
                    + افزودن آدرس جدید
                  </Link>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">روش پرداخت</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                  />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">پرداخت آنلاین</div>
                    <div className="text-sm text-gray-500">پرداخت از طریق درگاه بانکی</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">پرداخت در محل</div>
                    <div className="text-sm text-gray-500">پرداخت نقدی هنگام تحویل سفارش</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Notes */}
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">یادداشت سفارش (اختیاری)</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                placeholder="هرگونه نکته خاص درباره سفارش خود را وارد کنید..."
                className="input-field"
              />
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || addresses.length === 0}
              className="btn-primary w-full disabled:opacity-50"
            >
              {submitting ? 'در حال ثبت سفارش...' : 'ثبت نهایی سفارش'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="card p-6 sticky top-20">
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
                <span>در مرحله بعد محاسبه می‌شود</span>
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