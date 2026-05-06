import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice, formatNumber } from '../utils/format';
import DiscountBadge from '../components/DiscountBadge';

const ProductDetail = () => {
  const { slug } = useParams();
  const { product, loading } = useProduct(slug);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stockError, setStockError] = useState('');

  const images = product?.images || [];
  const currentImage = images[currentImageIndex]?.image || null;

  // Max allowed = stock_quantity (if tracked) or 999
  const maxAllowed = product?.track_inventory ? (product?.stock_quantity || 0) : 999;

  const increaseQuantity = () => {
    if (quantity < maxAllowed) {
      setQuantity(quantity + 1);
      setStockError('');
    } else {
      setStockError(`تنها ${maxAllowed} عدد از این محصول موجود است.`);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setStockError('');
    }
  };

  const handleQuantityChange = (e) => {
    let val = parseInt(e.target.value) || 1;
    if (maxAllowed > 0 && val > maxAllowed) {
      val = maxAllowed;
      setStockError(`تنها ${maxAllowed} عدد از این محصول موجود است.`);
    } else {
      setStockError('');
    }
    setQuantity(Math.max(1, val));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (!product.in_stock && product.track_inventory) {
      setStockError('این محصول موجود نیست.');
      return;
    }
    if (quantity > maxAllowed && maxAllowed > 0) {
      setStockError(`تنها ${maxAllowed} عدد موجود است.`);
      return;
    }
    try {
      await addItem({ product_id: product.id, quantity });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setStockError('خطا در افزودن به سبد خرید');
    }
  };

  const nextImage = () => {
    if (images.length) setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    if (images.length) setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) return <div className="text-center py-8">در حال بارگذاری...</div>;
  if (!product) return <div className="text-center py-8">محصول یافت نشد</div>;

  const isInStock = product.in_stock || product.stock_quantity > 0;
  const stockText = isInStock ? 'موجود' : 'ناموجود';
  const stockClass = isInStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  return (
    <div className="product-detail container mx-auto px-4 py-8 mb-16 md:mb-0" dir="rtl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Carousel */}
        <div className="md:w-1/2">
          <div className="relative w-full pb-[75%]">
            <img
              src={currentImage || '/placeholder.jpg'}
              alt={product.name}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg"
            />
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 z-10">‹</button>
                <button onClick={nextImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 z-10">›</button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((img, idx) => (
                <img
                  key={img.id}
                  src={img.image}
                  alt={`thumb ${idx + 1}`}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${idx === currentImageIndex ? 'border-primary-500' : 'border-transparent'}`}
                  onClick={() => setCurrentImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          {/* Discount Badge (reusable) */}
          <DiscountBadge percentage={product.discount_percentage} size="large" />

          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{product.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{product.description || product.short_description}</p>

          <div className="border-t border-b border-gray-200 dark:border-dark-border py-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">قیمت:</span>
              <div className="text-left">
                <span className="text-2xl text-primary-600 dark:text-primary-400 font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.compare_price && (
                  <span className="text-gray-400 line-through text-sm mr-2">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700 dark:text-gray-300">موجودی:</span>
              <span className={stockClass}>{stockText}</span>
            </div>
            {product.track_inventory && (
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>موجودی انبار:</span>
                <span>{formatNumber(product.stock_quantity)} عدد</span>
              </div>
            )}
          </div>

          {/* Quantity Selector – desktop visible */}
          {isInStock && (
            <div className="mb-4 hidden md:block">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">تعداد:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg disabled:opacity-50 text-gray-700 dark:text-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-20 text-center border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= maxAllowed && maxAllowed > 0}
                  className="w-10 h-10 border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg disabled:opacity-50 text-gray-700 dark:text-gray-300"
                >
                  +
                </button>
              </div>
              {stockError && <p className="text-red-600 dark:text-red-400 text-sm mt-2">{stockError}</p>}
            </div>
          )}

          {/* Add to Cart Button – desktop */}
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isInStock
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 dark:bg-dark-border text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {isInStock ? 'افزودن به سبد خرید' : 'ناموجود'}
          </button>

          {addedToCart && (
            <div className="mt-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-lg text-center">
              محصول به سبد خرید اضافه شد!
            </div>
          )}
        </div>
      </div>

      {/* Sticky Add to Cart Bar – only on mobile */}
      {isInStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border p-3 shadow-lg z-40 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 dark:text-gray-300 text-sm">تعداد:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-8 h-8 border border-gray-300 dark:border-dark-border rounded hover:bg-gray-100 dark:hover:bg-dark-bg disabled:opacity-50 text-gray-700 dark:text-gray-300"
                >
                  -
                </button>
                <span className="w-8 text-center text-gray-800 dark:text-white">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= maxAllowed && maxAllowed > 0}
                  className="w-8 h-8 border border-gray-300 dark:border-dark-border rounded hover:bg-gray-100 dark:hover:bg-dark-bg disabled:opacity-50 text-gray-700 dark:text-gray-300"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                isInStock
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 dark:bg-dark-border text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {isInStock ? 'افزودن به سبد خرید' : 'ناموجود'}
            </button>
          </div>
          {stockError && <p className="text-red-600 dark:text-red-400 text-xs mt-1 text-center">{stockError}</p>}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;