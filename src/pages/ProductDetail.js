import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const ProductDetail = () => {
  const { slug } = useParams();
  const { product, loading } = useProduct(slug);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [maxOrderError, setMaxOrderError] = useState('');

  // Extract images array from product (backend uses 'images' field)
  const images = product?.images || [];
  const currentImage = images[currentImageIndex]?.image || null;

  // Maximum allowed quantity (0 = unlimited)
  const maxAllowed = product?.max_order_quantity || 0;

  const increaseQuantity = () => {
    if (maxAllowed === 0 || quantity < maxAllowed) {
      setQuantity(quantity + 1);
      setMaxOrderError('');
    } else if (maxAllowed > 0) {
      setMaxOrderError(`حداکثر تعداد مجاز برای این محصول ${maxAllowed} عدد است.`);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setMaxOrderError('');
    }
  };

  const handleQuantityChange = (e) => {
    let val = parseInt(e.target.value) || 1;
    if (maxAllowed > 0 && val > maxAllowed) {
      val = maxAllowed;
      setMaxOrderError(`حداکثر تعداد مجاز ${maxAllowed} عدد است.`);
    } else {
      setMaxOrderError('');
    }
    setQuantity(Math.max(1, val));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (!product.in_stock && product.track_inventory) {
      return;
    }

    // Double-check max quantity before sending
    if (maxAllowed > 0 && quantity > maxAllowed) {
      setMaxOrderError(`حداکثر تعداد مجاز ${maxAllowed} عدد است.`);
      return;
    }

    try {
      await addItem({
        product_id: product.id,
        quantity: quantity,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  if (!product) {
    return <div className="text-center py-8">محصول یافت نشد</div>;
  }

  const isInStock = product.in_stock || product.stock_quantity > 0;
  const stockText = isInStock ? 'موجود' : 'ناموجود';
  const stockClass = isInStock ? 'text-green-600' : 'text-red-600';

  return (
    <div className="product-detail container mx-auto px-4 py-8" dir="rtl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image Section with Carousel */}
        <div className="md:w-1/2">
          <div className="relative w-full pb-[75%]">
            <img
              src={currentImage || '/placeholder.jpg'}
              alt={product.name}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg"
            />
            {images.length > 1 && (
              <>
                {/* Previous button – on the right side (RTL) */}
                <button
                  onClick={prevImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 z-10"
                >
                  ‹
                </button>
                {/* Next button – on the left side (RTL) */}
                <button
                  onClick={nextImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 z-10"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((img, idx) => (
                <img
                  key={img.id}
                  src={img.image}
                  alt={`thumb ${idx + 1}`}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                    idx === currentImageIndex ? 'border-blue-600' : 'border-transparent'
                  }`}
                  onClick={() => setCurrentImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description || product.short_description}</p>

          <div className="border-t border-b py-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">قیمت:</span>
              <span className="text-2xl text-blue-600 font-bold">
                {product.price?.toLocaleString()} تومان
              </span>
            </div>
            {product.compare_price && (
              <div className="flex justify-between mb-2 text-gray-500">
                <span>قیمت قبلی:</span>
                <span className="line-through">{product.compare_price?.toLocaleString()} تومان</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-semibold">موجودی:</span>
              <span className={stockClass}>{stockText}</span>
            </div>
          </div>

          {/* Quantity Selector - only show if in stock */}
          {isInStock && (
            <div className="mb-4">
              <label className="block mb-2">تعداد:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseQuantity}
                  className="w-10 h-10 border rounded-lg hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-20 text-center border rounded-lg p-2"
                />
                <button
                  onClick={increaseQuantity}
                  className="w-10 h-10 border rounded-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              {maxOrderError && (
                <p className="text-red-600 text-sm mt-2">{maxOrderError}</p>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isInStock
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isInStock ? 'افزودن به سبد خرید' : 'ناموجود'}
          </button>

          {/* Success Message */}
          {addedToCart && (
            <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg text-center">
              محصول به سبد خرید اضافه شد!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;