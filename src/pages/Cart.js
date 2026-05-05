import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/format';

const Cart = () => {
  const { cart, updateItem, removeItem, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();

  // Helper to get product image – using product_details from cart API
  const getProductImage = (item) => {
    const details = item.product_details;
    if (details?.primary_image) return details.primary_image;
    if (details?.image) return details.image;
    return '/placeholder.jpg';
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
                  src={getProductImage(item)}
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

        {/* Order Summary – already dark mode ready */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 dark:bg-dark-surface rounded-xl p-6 border border-gray-200 dark:border-dark-border sticky top-20">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">خلاصه سفارش</h2>
            <div className="border-t border-gray-200 dark:border-dark-border pt-4">
              <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
                <span>جمع کل:</span>
                <span className="font-semibold text-primary-600 dark:text-primary-400">{formatPrice(cart.total)}</span>
              </div>
              <div className="flex justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
                <span>هزینه ارسال:</span>
                <span>در مرحله بعد محاسبه می‌شود</span>
              </div>
              <Link
                to="/checkout"
                className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                ادامه فرآیند خرید
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;