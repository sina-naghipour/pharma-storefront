import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useProducts, useCategories } from '../hooks/useProducts';
import { formatPrice } from '../utils/format';
import BlogService from '../api/BlogService';
import DiscountBadge from '../components/DiscountBadge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = () => {
  const { products, loading: productsLoading } = useProducts({ featured: true });
  const { categories, loading: categoriesLoading } = useCategories();
  const [latestPosts, setLatestPosts] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(true);

  const [heroImages] = useState([
    {
      id: 1,
      title: 'محصولات دارویی با کیفیت',
      subtitle: 'تضمین اصالت و سلامت',
      image: '/images/hero-pharmacy.jpg',
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

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const data = await BlogService.getPosts({ ordering: '-published_at', page_size: 3 });
        setLatestPosts(data.results || data);
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
      } finally {
        setTipsLoading(false);
      }
    };
    fetchLatestPosts();
  }, []);

  const getCategoryImage = (category) => category.image || '/placeholder-category.jpg';

  return (
    <div className="home-page">
      {/* Hero Carousel */}
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
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white p-4">
                  <h2 className="text-3xl md:text-5xl font-bold mb-2">{slide.title}</h2>
                  <p className="text-lg md:text-2xl mb-6">{slide.subtitle}</p>
                  <Link to={slide.link} className="btn-primary">
                    مشاهده محصولات
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">چرا داروخانه دکتر نقی پور؟</h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'M5 13l4 4L19 7', title: 'محصولات اصل و تضمینی', desc: 'تمامی محصولات دارای ضمانت اصالت و سلامت' },
              { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'ارسال سریع و مطمئن', desc: 'تحویل سفارش در کوتاه‌ترین زمان ممکن' },
              { icon: 'M3 10h18M7 15h10M9 5h6', title: 'قیمت رقابتی', desc: 'بهترین قیمت‌ها در مقایسه با بازار' },
              { icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'مشاوره رایگان', desc: 'تیم داروسازان آماده پاسخگویی' }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-4 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-dark-border">
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-base font-semibold mb-1 text-gray-800 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid - 70x70 images */}
      <section className="py-8 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">دسته‌بندی محصولات</h2>
            <div className="w-12 h-0.5 bg-primary-500 mx-auto rounded-full"></div>
          </div>
          {categoriesLoading ? (
            <div className="flex justify-center py-6"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories?.slice(0, 6).map((category) => (
                <Link key={category.id} to={`/category/${category.slug}`} className="group block text-center">
                  <div className="bg-gray-50 dark:bg-dark-surface rounded-lg overflow-hidden shadow-sm hover:shadow transition-all p-2">
                    <div className="flex justify-center">
                      <div className="w-[70px] h-[70px] flex items-center justify-center bg-transparent rounded-md">
                        <img 
                          src={getCategoryImage(category)} 
                          alt={category.name} 
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" 
                        />
                      </div>
                    </div>
                    <h3 className="mt-1 text-[0.7rem] font-medium text-gray-800 dark:text-white truncate">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers - with card class */}
      <section className="py-12 bg-gray-50 dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">پرفروش‌ترین محصولات</h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.slice(4, 8).map((product) => (
              <div key={product.id} className="group card bg-white dark:bg-dark-surface">
                <Link to={`/products/${product.slug}`}>
                  <div className="flex justify-center pt-4">
                    <div className="relative w-32 h-32 overflow-hidden rounded-lg">
                      <img
                        src={product.primary_image || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <DiscountBadge percentage={product.discount_percentage} />
                      {!product.in_stock && (
                        <span className="absolute top-1 left-1 bg-gray-700 text-white text-xs px-1.5 py-0.5 rounded-full">ناموجود</span>
                      )}
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-semibold text-sm text-gray-800 dark:text-white mb-1 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-center gap-2 flex-wrap mt-1">
                      <span className="text-primary-600 dark:text-primary-400 font-bold text-base">
                        {formatPrice(product.price)}
                      </span>
                      {product.compare_price && (
                        <span className="text-gray-400 line-through text-xs">
                          {formatPrice(product.compare_price)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {product.manufacturer_name || 'نامشخص'}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - with card class */}
      <section className="py-12 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">محصولات ویژه</h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
          </div>
          {productsLoading ? (
            <div className="flex justify-center py-12"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.slice(0, 4).map(product => (
                <div key={product.id} className="group card bg-gray-50 dark:bg-dark-surface">
                  <Link to={`/products/${product.slug}`}>
                    <div className="flex justify-center pt-4">
                      <div className="relative w-32 h-32 overflow-hidden rounded-lg">
                        <img
                          src={product.primary_image || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <DiscountBadge percentage={product.discount_percentage} />
                        {!product.in_stock && (
                          <span className="absolute top-1 left-1 bg-gray-700 text-white text-xs px-1.5 py-0.5 rounded-full">ناموجود</span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="font-semibold text-sm text-gray-800 dark:text-white mb-1 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center justify-center gap-2 flex-wrap mt-1">
                        <span className="text-primary-600 dark:text-primary-400 font-bold text-base">
                          {formatPrice(product.price)}
                        </span>
                        {product.compare_price && (
                          <span className="text-gray-400 line-through text-xs">
                            {formatPrice(product.compare_price)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {product.manufacturer_name || 'نامشخص'}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/products" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:gap-3 transition text-sm">
              مشاهده همه محصولات
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 bg-gray-50 dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">مجله سلامت</h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm">نکات و مقالات تخصصی</p>
          </div>
          {tipsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : latestPosts.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">هیچ مقاله‌ای یافت نشد</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                  <div className="bg-white dark:bg-dark-bg rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                    <div className="h-48 bg-primary-200 dark:bg-primary-900/50 flex items-center justify-center">
                      <img 
                        src={post.featured_image || '/placeholder-blog.jpg'} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-xs text-primary-600 dark:text-primary-400 mb-1">{post.category_name}</div>
                      <h3 className="text-base font-semibold text-gray-800 dark:text-white group-hover:text-primary-600 transition line-clamp-1">{post.title}</h3>
                      <div className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 text-xs">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            p: ({ node, ...props }) => <p style={{ fontSize: '0.65rem', lineHeight: '1.3', margin: 0 }} {...props} />,
                            h1: ({ node, ...props }) => <p style={{ fontSize: '0.65rem', lineHeight: '1.3', margin: 0, fontWeight: 'normal' }} {...props} />,
                            h2: ({ node, ...props }) => <p style={{ fontSize: '0.65rem', lineHeight: '1.3', margin: 0, fontWeight: 'normal' }} {...props} />,
                            h3: ({ node, ...props }) => <p style={{ fontSize: '0.65rem', lineHeight: '1.3', margin: 0, fontWeight: 'normal' }} {...props} />,
                            strong: ({ node, ...props }) => <strong style={{ fontWeight: '600' }} {...props} />,
                            a: ({ node, ...props }) => <a style={{ color: '#3b82f6' }} {...props} />
                          }}
                        >
                          {post.summary || ''}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/blog" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline text-sm">
              مشاهده همه مقالات →
            </Link>
          </div>
        </div>
      </section>

  {/* Newsletter - with bottom padding to separate from footer */}
  <section className="pt-10 pb-8 bg-primary-500 dark:bg-primary-700">
    <div className="container mx-auto px-4 text-center">
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        {/* trust badges unchanged */}
        <div className="flex items-center gap-2 text-white text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>پرداخت امن</span>
        </div>
        <div className="flex items-center gap-2 text-white text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>ضمانت اصالت کالا</span>
        </div>
        <div className="flex items-center gap-2 text-white text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>ارسال به سراسر ایران</span>
        </div>
      </div>
      <h3 className="text-xl text-white font-bold mb-2">عضویت در خبرنامه</h3>
      <p className="text-primary-100 mb-5 text-sm">از تخفیف‌ها و محصولات جدید با خبر شوید</p>
      <div className="max-w-md mx-auto flex gap-2">
        <input type="email" placeholder="ایمیل خود را وارد کنید" className="flex-1 rounded-full px-4 py-2 text-gray-900 text-sm" />
        <button className="bg-white text-primary-600 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition text-sm">
          ثبت
        </button>
      </div>
    </div>
  </section>
    </div>
  );
};

export default Home;