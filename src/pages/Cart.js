import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/format';

const Cart = () => {
  const { cart, updateItem, removeItem, clearCart, loading, applyCoupon } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Helper to get product image from product_details
  const getProductImage = (productDetails) => {
    if (productDetails?.primary_image) return productDetails.primary_image;
    if (productDetails?.image) return productDetails.image;
    return '/placeholder.jpg';
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
      setCouponError(err.message || 'کد تخفیف صحیح نمی باشد');
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-page container mx-auto px-4 py-8 text-center">
        <p className="text-xl mb-4 text-gray-700 dark:text-gray-300">لطفا ابتدا وارد حساب کاربری خود شوید</p>
        <Link to="/login" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
          ورود به حساب
        </Link>
      </div>
    );
  }

  if (loading) return <div className="text-center py-8 text-gray-600 dark:text-gray-400">در حال بارگذاری...</div>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">سبد خرید خالی است</h1>
        <Link to="/products" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0) {
      updateItem({ item_id: item.id, quantity: newQuantity });
    }
  };

  const subtotal = cart.subtotal || 0;
  const discount = cart.discount_amount || 0;
  const total = cart.total || 0;

  return (
    <div className="cart-page container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">سبد خرید</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-dark-border">
            {cart.items.map((item) => (
              <div key={item.id} className="border-b border-gray-100 dark:border-dark-border p-4 flex flex-col sm:flex-row gap-4">
                <img
                  src={getProductImage(item.product_details)}
                  alt={item.product_details?.name || 'محصول'}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                    {item.product_details?.name || 'محصول'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{formatPrice(item.unit_price)}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      className="w-8 h-8 border border-gray-300 dark:border-dark-border rounded hover:bg-gray-100 dark:hover:bg-dark-bg text-gray-700 dark:text-gray-300"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-gray-800 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      className="w-8 h-8 border border-gray-300 dark:border-dark-border rounded hover:bg-gray-100 dark:hover:bg-dark-bg text-gray-700 dark:text-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem({ item_id: item.id })}
                      className="ml-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      حذف
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {formatPrice(item.unit_price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={clearCart}
            className="mt-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
          >
            حذف همه موارد
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 dark:bg-dark-surface rounded-xl p-6 border border-gray-200 dark:border-dark-border sticky top-20">
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

            {/* Coupon Section */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-border">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">کد تخفیف</label>
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

            <Link
              to="/checkout"
              className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700 transition mt-6"
            >
              ادامه فرآیند خرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;