import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const Cart = () => {
  const { cart, updateItem, removeItem, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();

  // Log cart data to console for debugging
  useEffect(() => {
    if (cart) {
      console.log('Cart data:', cart);
      if (cart.items && cart.items.length > 0) {
        console.log('First item product:', cart.items[0].product);
      }
    }
  }, [cart]);

  // Helper to get product image URL from cart item
  const getProductImage = (product) => {
    console.log('Product image fields:', {
      hasImages: !!product.images,
      imagesLength: product.images?.length,
      primary_image: product.primary_image,
      image: product.image
    });
    
    // Try different possible fields
    if (product.images && product.images.length > 0) {
      return product.images[0].image;
    }
    if (product.primary_image) {
      return product.primary_image;
    }
    if (product.image) {
      return product.image;
    }
    // Temporary hardcoded test image to verify image loading works
    return 'https://via.placeholder.com/100?text=No+Image';
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-page container mx-auto px-4 py-8 text-center">
        <p className="text-xl mb-4">لطفا ابتدا وارد حساب کاربری خود شوید</p>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          ورود به حساب
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">سبد خرید خالی است</h1>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0) {
      updateItem({
        item_id: item.id,
        quantity: newQuantity
      });
    }
  };

  return (
    <div className="cart-page container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">سبد خرید</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow">
            {cart.items.map((item) => (
              <div key={item.id} className="border-b p-4 flex flex-col sm:flex-row gap-4">
                <img
                  src={item.product_details?.primary_image || '/placeholder.jpg'}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.src = 'https://via.placeholder.com/100?text=Image+Error';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                  <p className="text-gray-600 mb-2">{item.unit_price?.toLocaleString()} تومان</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      className="w-8 h-8 border rounded hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      className="w-8 h-8 border rounded hover:bg-gray-50"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem({ item_id: item.id })}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      حذف
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {(item.unit_price * item.quantity)?.toLocaleString()} تومان
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="mt-4 text-red-600 hover:text-red-800"
          >
            حذف همه موارد
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">خلاصه سفارش</h2>
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>جمع کل:</span>
                <span className="font-semibold">{cart.total?.toLocaleString()} تومان</span>
              </div>
              <div className="flex justify-between mb-4 text-sm text-gray-600">
                <span>هزینه ارسال:</span>
                <span>در مرحله بعد محاسبه می‌شود</span>
              </div>
              <Link
                to="/checkout"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700"
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