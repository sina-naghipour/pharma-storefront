import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useProducts';
import { formatPrice } from '../utils/format';
import DiscountBadge from '../components/DiscountBadge';

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
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const { products, loading, pagination } = useProducts({
    ...filters,
    page: currentPage,
  });
  
  const { categories, loading: categoriesLoading } = useCategories();
  
  const totalPages = pagination?.count ? Math.ceil(pagination.count / 10) : 1;
  
  const sortedProducts = useMemo(() => {
    if (!products) return [];
    if (filters.ordering === 'name') {
      return [...products].sort((a, b) => a.name.localeCompare(b.name, 'fa'));
    }
    if (filters.ordering === '-name') {
      return [...products].sort((a, b) => b.name.localeCompare(a.name, 'fa'));
    }
    return products;
  }, [products, filters.ordering]);
  
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
    if (newPage >= 1 && newPage <= totalPages) {
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

  const hasActiveFilters = () => {
    return (
      filters.search !== '' ||
      filters.min_price !== '' ||
      filters.max_price !== '' ||
      filters.category !== '' ||
      filters.product_type !== '' ||
      filters.in_stock !== ''
    );
  };
  
  return (
    <div className="products-page container mx-auto px-4 py-6" dir="rtl">
      <div className="flex flex-col gap-6">
        {/* Top bar */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg shadow-soft transition text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {filtersOpen ? 'بستن فیلترها' : 'نمایش فیلترها'}
            </button>
            
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-soft transition text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                حذف فیلترها
              </button>
            )}
            
            <label className="font-semibold text-gray-700 dark:text-gray-300 text-sm">مرتب‌سازی:</label>
            <select
              name="ordering"
              value={filters.ordering}
              onChange={handleFilterChange}
              className="border border-gray-200 dark:border-dark-border rounded-lg p-1.5 text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-300"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {!loading && pagination?.count !== undefined && (
              <span>{pagination.count} محصول یافت شد</span>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop sidebar - modern design */}
          {filtersOpen && (
            <aside className="hidden lg:block lg:w-1/4">
              <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border shadow-soft p-5 sticky top-20">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">فیلترها</h3>
                  {hasActiveFilters() && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 transition"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      پاک کردن همه
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">جستجو</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="نام محصول..."
                      className="w-full border border-gray-200 dark:border-dark-border rounded-lg py-2 pr-3 pl-8 bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
                    />
                    <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Category */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">دسته‌بندی</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    disabled={categoriesLoading}
                  >
                    <option value="">همه دسته‌ها</option>
                    {categories?.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Product Type */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">نوع محصول</label>
                  <select
                    name="product_type"
                    value={filters.product_type}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  >
                    {productTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range - fixed with grid */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">بازه قیمت (تومان)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="min_price"
                      value={filters.min_price}
                      onChange={handleFilterChange}
                      placeholder="از"
                      className="w-full border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="max_price"
                      value={filters.max_price}
                      onChange={handleFilterChange}
                      placeholder="تا"
                      className="w-full border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">موجودی</label>
                  <select
                    name="in_stock"
                    value={filters.in_stock}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  >
                    {stockOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Clear button (bottom) */}
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-border text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm font-medium transition"
                >
                  حذف همه فیلترها
                </button>
              </div>
            </aside>
          )}
          
          {/* Mobile drawer - modern sliding panel */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setFiltersOpen(false)}></div>
              <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-dark-surface shadow-xl overflow-y-auto">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">فیلترها</h3>
                    <button onClick={() => setFiltersOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">✕</button>
                  </div>

                  {/* Search */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">جستجو</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="نام محصول..."
                        className="w-full border border-gray-200 dark:border-dark-border rounded-lg py-2 pr-3 pl-8 bg-white dark:bg-dark-bg text-sm"
                      />
                      <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">دسته‌بندی</label>
                    <select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 bg-white dark:bg-dark-bg text-sm"
                      disabled={categoriesLoading}
                    >
                      <option value="">همه دسته‌ها</option>
                      {categories?.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Product Type */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">نوع محصول</label>
                    <select
                      name="product_type"
                      value={filters.product_type}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 bg-white dark:bg-dark-bg text-sm"
                    >
                      {productTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range - fixed with grid */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">بازه قیمت (تومان)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        name="min_price"
                        value={filters.min_price}
                        onChange={handleFilterChange}
                        placeholder="از"
                        className="w-full border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 text-sm"
                      />
                      <input
                        type="number"
                        name="max_price"
                        value={filters.max_price}
                        onChange={handleFilterChange}
                        placeholder="تا"
                        className="w-full border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 text-sm"
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">موجودی</label>
                    <select
                      name="in_stock"
                      value={filters.in_stock}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 bg-white dark:bg-dark-bg text-sm"
                    >
                      {stockOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Clear button */}
                  <button
                    onClick={clearFilters}
                    className="w-full bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-border text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm font-medium transition"
                  >
                    حذف همه فیلترها
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Product grid */}
          <main className={`${filtersOpen ? 'lg:w-3/4' : 'w-full'}`}>
            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
              </div>
            )}
            
            {!loading && products?.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
                هیچ محصولی با این فیلترها یافت نشد.
              </div>
            )}
            
            {!loading && products?.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sortedProducts.map((product) => (
                    <div key={product.id} className="group card bg-white dark:bg-dark-surface">
                      <Link to={`/products/${product.slug}`}>
                        <div className="flex justify-center pt-5">
                          <div className="relative w-44 h-44 overflow-hidden rounded-lg">
                            <img
                              src={product.primary_image || '/placeholder.jpg'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <DiscountBadge percentage={product.discount_percentage} size="small" />
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
                
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-200 dark:border-dark-border rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-dark-bg transition"
                    >
                      قبلی
                    </button>
                    <span className="px-3 py-1 text-gray-700 dark:text-gray-300 text-sm">
                      صفحه {currentPage} از {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-200 dark:border-dark-border rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-dark-bg transition"
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
    </div>
  );
};

export default Products;