import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../utils/format';

const Home = () => {
  const { products, loading } = useProducts({ featured: true });

  return (
    <div className="home-page">
      {/* Hero Section – Green gradient even in dark mode */}
      <section className="relative bg-gradient-to-br from-primary-100 via-primary-50 to-white dark:from-primary-900 dark:via-primary-800 dark:to-dark-bg overflow-hidden">
        {/* Decorative green blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 dark:bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-400 dark:bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-200 dark:bg-primary-700 rounded-full filter blur-3xl opacity-30"></div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-700 dark:text-primary-200 mb-6 tracking-tight">
            به داروخانه آنلاین خوش آمدید
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            تامین کننده مطمئن محصولات بهداشتی و دارویی با بهترین کیفیت
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            مشاهده محصولات
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Featured Products Section (dark mode ready, consistent green accents) */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">محصولات ویژه</h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-lg mx-auto">منتخب بهترین‌های داروخانه برای سلامتی شما</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">هیچ محصول ویژه‌ای یافت نشد.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="group bg-white dark:bg-dark-surface rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-dark-border"
                >
                  <Link to={`/products/${product.slug}`}>
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={product.primary_image || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {!product.in_stock && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">ناموجود</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">{formatPrice(product.price)}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{product.manufacturer_name || 'نامشخص'}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:gap-3 transition-all"
            >
              مشاهده همه محصولات
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action – green banner */}
      <section className="py-12 bg-primary-600 dark:bg-primary-700">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl text-white font-bold mb-3">نیاز به مشاوره دارویی دارید؟</h3>
          <p className="text-primary-100 mb-6">تیم متخصص ما آماده پاسخگویی به سوالات شماست</p>
          <Link
            to="/contact"
            className="inline-block bg-white text-primary-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition shadow-md"
          >
            تماس با پشتیبانی
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;