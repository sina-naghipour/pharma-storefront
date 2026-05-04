import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

const Home = () => {
  const { products, loading } = useProducts({ featured: true });

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">به داروخانه آنلاین خوش آمدید</h1>
          <p className="text-xl mb-8">تامین کننده مطمئن محصولات بهداشتی و دارویی</p>
          <Link 
            to="/products" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            مشاهده محصولات
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">محصولات ویژه</h2>
          {loading ? (
            <div className="text-center">در حال بارگذاری...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.slice(0, 4).map((product) => (
                <div key={product.id} className="product-card border rounded-lg p-4 hover:shadow-lg transition">
                  <img 
                    src={product.primary_image || '/placeholder.jpg'} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.price?.toLocaleString()} تومان</p>
                  <Link 
                    to={`/products/${product.slug}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    مشاهده جزئیات
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
