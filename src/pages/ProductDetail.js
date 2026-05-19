import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice, formatNumber } from '../utils/format';
import DiscountBadge from '../components/DiscountBadge';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import ProductService from '../api/ProductService';

const ProductDetail = () => {
  const { slug } = useParams();
  const { product, loading } = useProduct(slug);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stockError, setStockError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  const images = product?.images || [];
  const currentImage = images[currentImageIndex]?.image || null;
  const maxAllowed = product?.track_inventory ? (product?.stock_quantity || 0) : 999;
  const description = product?.description || '';
  const shouldTruncate = description.length > 500;
  const shortDescription = shouldTruncate ? description.slice(0, 500) + '...' : description;

  useEffect(() => {
    if (product?.slug) {
      fetchSimilarProducts();
    }
  }, [product]);

  const fetchSimilarProducts = async () => {
    try {
      setSimilarLoading(true);
      const response = await ProductService.getSimilarProducts(product.slug);
      setSimilarProducts(response.results || response);
    } catch (error) {
      console.error('Error fetching similar products:', error);
    } finally {
      setSimilarLoading(false);
    }
  };

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

  const firstCategory = product.categories && product.categories.length > 0 ? product.categories[0] : null;
  const categoryName = firstCategory?.name;
  const categorySlug = firstCategory?.slug;

  return (
    <div className="product-detail container mx-auto px-4 py-8 mb-16 md:mb-0" dir="rtl">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-primary-600 transition">خانه</Link>
        <span className="mx-2">›</span>
        <Link to="/products" className="hover:text-primary-600 transition">محصولات</Link>
        {categoryName && (
          <>
            <span className="mx-2">›</span>
            {categorySlug ? (
              <Link to={`/category/${categorySlug}`} className="hover:text-primary-600 transition">
                {categoryName}
              </Link>
            ) : (
              <span className="text-gray-600">{categoryName}</span>
            )}
          </>
        )}
        <span className="mx-2">›</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Carousel */}
        <div className="md:w-1/2">
          <div className="relative w-full pb-[75%]">
            <img
              src={currentImage || '/placeholder.jpg'}
              alt={product.name}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-xl shadow-soft"
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
          <DiscountBadge percentage={product.discount_percentage} size="large" />
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{product.name}</h1>

          {product.short_description && (
            <div className="text-gray-600 dark:text-gray-400 mb-4 prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {product.short_description}
              </ReactMarkdown>
            </div>
          )}

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

          {isInStock && (
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">تعداد:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg disabled:opacity-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-20 text-center border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg"
                />
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= maxAllowed && maxAllowed > 0}
                  className="w-10 h-10 border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg disabled:opacity-50"
                >
                  +
                </button>
              </div>
              {stockError && <p className="text-red-600 text-sm mt-2">{stockError}</p>}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isInStock
                ? 'btn-primary'
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

      {/* Description */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4 text-primary-600 dark:text-primary-400">توضیحات محصول</h2>
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
          {expanded || !shouldTruncate ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {description}
            </ReactMarkdown>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {shortDescription}
            </ReactMarkdown>
          )}
        </div>
        {shouldTruncate && (
          <div className="text-center mt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-primary-600 hover:underline focus:outline-none"
            >
              {expanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
            </button>
          </div>
        )}
      </div>

      {/* Similar Products */}
      {!similarLoading && similarProducts.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold mb-4 text-primary-600 dark:text-primary-400">محصولات مشابه</h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">
              {similarProducts.map((similarProduct) => (
                <Link
                  key={similarProduct.id}
                  to={`/products/${similarProduct.slug}`}
                  className="block min-w-[200px] md:min-w-0 group card bg-white dark:bg-dark-surface flex-shrink-0"
                >
                  <div className="relative overflow-hidden h-40">
                    <img
                      src={similarProduct.primary_image || '/placeholder.jpg'}
                      alt={similarProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <DiscountBadge percentage={similarProduct.discount_percentage} />
                    {!similarProduct.in_stock && (
                      <span className="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full">ناموجود</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-base text-gray-800 dark:text-white mb-1 line-clamp-1">{similarProduct.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">
                        {formatPrice(similarProduct.price)}
                      </span>
                      {similarProduct.compare_price && (
                        <span className="text-gray-400 line-through text-xs">
                          {formatPrice(similarProduct.compare_price)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {similarProduct.manufacturer_name || 'نامشخص'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-12 border-t pt-8">
        <ReviewList productId={product.id} />
        <ReviewForm productId={product.id} productSlug={product.slug} onSuccess={() => window.location.reload()} />
      </div>

      {/* Sticky Add to Cart Bar – mobile only */}
      {isInStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border p-3 shadow-lg z-40 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 dark:text-gray-300 text-sm">تعداد:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= maxAllowed && maxAllowed > 0}
                  className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                isInStock ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isInStock ? 'افزودن به سبد خرید' : 'ناموجود'}
            </button>
          </div>
          {stockError && <p className="text-red-600 text-xs mt-1 text-center">{stockError}</p>}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;