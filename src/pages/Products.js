import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../utils/format';

const Products = () => {
  const { slug } = useParams();
  const [filters, setFilters] = useState({});
  const { products, loading, pagination } = useProducts(filters);

  useEffect(() => {
    if (slug) {
      setFilters({ category: slug });
    }
  }, [slug]);

  return (
    <div className="products-page container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="md:w-1/4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4">فیلترها</h3>
            <div className="mb-4">
              <label className="block mb-2">جستجو</label>
              <input 
                type="text" 
                className="w-full border rounded-lg p-2"
                placeholder="نام محصول..."
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">حداقل قیمت</label>
              <input 
                type="number" 
                className="w-full border rounded-lg p-2"
                onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
              />
            </div>
            <button 
              onClick={() => setFilters({})}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              حذف فیلترها
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="md:w-3/4">
          {loading ? (
            <div className="text-center py-8">در حال بارگذاری...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                    <img 
                      src={product.primary_image || '/placeholder.jpg'} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2">{formatPrice(product.price)}</p>
                    <Link 
                      to={`/products/${product.slug}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      مشاهده جزئیات
                    </Link>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination && (
                <div className="flex justify-center gap-2 mt-8">
                  {pagination.previous && (
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                      قبلی
                    </button>
                  )}
                  {pagination.next && (
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                      بعدی
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
