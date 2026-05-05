import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useProducts';
import { formatPrice } from '../utils/format';

const Products = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    search: '',
    min_price: '',
    max_price: '',
    category: slug || '',
    product_type: '',
    in_stock: '',
    ordering: '-created_at',
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  const { products, loading, pagination, refetch } = useProducts({
    ...filters,
    page: currentPage,
  });
  
  const { categories, loading: categoriesLoading } = useCategories();
  
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  
  useEffect(() => {
    setFilters(prev => ({ ...prev, category: slug || '' }));
  }, [slug]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      min_price: '',
      max_price: '',
      category: '',
      product_type: '',
      in_stock: '',
      ordering: '-created_at',
    });
    navigate('/products');
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination?.totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const productTypeOptions = [
    { value: '', label: 'همه' },
    { value: 'medication', label: 'دارو' },
    { value: 'medical_supply', label: 'تجهیزات پزشکی' },
    { value: 'supplement', label: 'مکمل' },
    { value: 'equipment', label: 'دستگاه پزشکی' },
    { value: 'personal_care', label: 'مراقبت شخصی' },
  ];
  
  const sortOptions = [
    { value: '-created_at', label: 'جدیدترین' },
    { value: 'created_at', label: 'قدیمی‌ترین' },
    { value: 'price', label: 'قیمت: کم به زیاد' },
    { value: '-price', label: 'قیمت: زیاد به کم' },
    { value: 'name', label: 'نام: الفبا' },
    { value: '-name', label: 'نام: الفبا معکوس' },
  ];
  
  const stockOptions = [
    { value: '', label: 'همه' },
    { value: 'true', label: 'فقط موجود' },
    { value: 'false', label: 'فقط ناموجود' },
  ];
  
  return (
    <div className="products-page container mx-auto px-4 py-8" dir="rtl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Dark mode ready */}
        <aside className="lg:w-1/4">
          <div className="bg-gray-50 dark:bg-dark-surface p-4 rounded-xl sticky top-20 border border-gray-200 dark:border-dark-border shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">فیلترها</h3>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">جستجو</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="نام محصول..."
                className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">دسته‌بندی</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                disabled={categoriesLoading}
              >
                <option value="">همه دسته‌ها</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">نوع محصول</label>
              <select
                name="product_type"
                value={filters.product_type}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
              >
                {productTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">بازه قیمت (تومان)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="min_price"
                  value={filters.min_price}
                  onChange={handleFilterChange}
                  placeholder="از"
                  className="w-1/2 border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  name="max_price"
                  value={filters.max_price}
                  onChange={handleFilterChange}
                  placeholder="تا"
                  className="w-1/2 border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">موجودی</label>
              <select
                name="in_stock"
                value={filters.in_stock}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
              >
                {stockOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={clearFilters}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
            >
              حذف همه فیلترها
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="lg:w-3/4">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold text-gray-700 dark:text-gray-300">مرتب‌سازی:</label>
              <select
                name="ordering"
                value={filters.ordering}
                onChange={handleFilterChange}
                className="border border-gray-300 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {!loading && pagination?.totalCount !== undefined && (
                <span>{pagination.totalCount} محصول یافت شد</span>
              )}
            </div>
          </div>
          
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          )}
          
          {!loading && products?.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              هیچ محصولی با این فیلترها یافت نشد.
            </div>
          )}
          
          {!loading && products?.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group bg-white dark:bg-dark-surface rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-dark-border">
                    <Link to={`/products/${product.slug}`}>
                      <div className="relative overflow-hidden h-48">
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
              
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 dark:border-dark-border rounded disabled:opacity-50 text-gray-700 dark:text-gray-300"
                  >
                    قبلی
                  </button>
                  <span className="px-3 py-1 text-gray-700 dark:text-gray-300">
                    صفحه {currentPage} از {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 dark:border-dark-border rounded disabled:opacity-50 text-gray-700 dark:text-gray-300"
                  >
                    بعدی
                  </button>
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