import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useProducts, useCategories } from '../hooks/useProducts'; 
import { formatPrice } from '../utils/format';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = () => {
  const { products, loading: productsLoading } = useProducts({ featured: true });
  const { categories, loading: categoriesLoading } = useCategories(); // fetch root categories
  const [heroImages, setHeroImages] = useState([
    {
      id: 1,
      title: 'محصولات دارویی با کیفیت',
      subtitle: 'تضمین اصالت و سلامت',
      image: '/images/hero-pharmacy.jpg', // replace with actual URLs
      link: '/products?product_type=medication'
    },
    {
      id: 2,
      title: 'مکمل‌های غذایی اصل',
      subtitle: 'تقویت سیستم ایمنی',
      image: '/images/hero-supplements.jpg',
      link: '/products?product_type=supplement'
    },
    {
      id: 3,
      title: 'مراقبت از پوست و مو',
      subtitle: 'محصولات خارجی و ایرانی',
      image: '/images/hero-skincare.jpg',
      link: '/products?product_type=personal_care'
    },
  ]);

  // You can also fetch category images from backend – for now use a placeholder
  const getCategoryImage = (category) => {
    return category.image || '/placeholder-category.jpg';
  };

  return (
    <div className="home-page">
      {/* HERO CAROUSEL */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="h-[500px] md:h-[600px]"
        >
          {heroImages.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white p-4">
                  <h2 className="text-3xl md:text-5xl font-bold mb-2">{slide.title}</h2>
                  <p className="text-lg md:text-2xl mb-6">{slide.subtitle}</p>
                  <Link
                    to={slide.link}
                    className="bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-full font-semibold transition shadow-lg"
                  >
                    مشاهده محصولات
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* CATEGORY GRID */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              دسته‌بندی محصولات
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              بر اساس نیاز خود انتخاب کنید
            </p>
          </div>

          {categoriesLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories?.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="group block text-center"
                >
                  <div className="bg-gray-100 dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 p-4">
                    <img
                      src={getCategoryImage(category)}
                      alt={category.name}
                      className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <h3 className="mt-3 font-semibold text-gray-800 dark:text-white">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 bg-gray-50 dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              محصولات ویژه
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              منتخب بهترین‌های داروخانه
            </p>
          </div>

          {productsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="group bg-white dark:bg-dark-bg rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-dark-border"
                >
                  <Link to={`/products/${product.slug}`}>
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={product.primary_image || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {!product.in_stock && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          ناموجود
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {product.manufacturer_name || 'نامشخص'}
                        </span>
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

      {/* OPTIONAL: BANNER / NEWSLETTER */}
      <section className="py-12 bg-primary-600 dark:bg-primary-800">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl text-white font-bold mb-3">عضویت در خبرنامه</h3>
          <p className="text-primary-100 mb-6">از تخفیف‌ها و محصولات جدید با خبر شوید</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="ایمیل خود را وارد کنید"
              className="flex-1 rounded-full px-4 py-2 text-gray-900"
            />
            <button className="bg-white text-primary-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
              ثبت
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;