import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderService from '../api/OrderService';
import { formatPrice } from '../utils/format';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cancellingId, setCancellingId] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'همه سفارشات' },
    { value: 'pending', label: 'در انتظار پرداخت' },
    { value: 'payment_processing', label: 'در حال پردازش پرداخت' },
    { value: 'paid', label: 'پرداخت شده' },
    { value: 'preparing', label: 'در حال آماده‌سازی' },
    { value: 'shipped', label: 'ارسال شده' },
    { value: 'delivered', label: 'تحویل شده' },
    { value: 'cancelled', label: 'لغو شده' },
  ];

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, searchTerm, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(searchTerm && { search: searchTerm }),
      };
      const response = await OrderService.getOrders(params);
      const ordersData = response.results || response;
      setOrders(ordersData);
      setTotalPages(Math.ceil((response.count || ordersData.length) / 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('آیا از لغو این سفارش مطمئن هستید؟')) return;
    setCancellingId(orderId);
    setError('');
    setSuccess('');
    try {
      await OrderService.cancelOrder(orderId);
      setSuccess('سفارش با موفقیت لغو شد');
      fetchOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'خطا در لغو سفارش');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      payment_processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      paid: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      preparing: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      shipped: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
      delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'در انتظار پرداخت',
      payment_processing: 'در حال پردازش پرداخت',
      paid: 'پرداخت شده',
      preparing: 'در حال آماده‌سازی',
      shipped: 'ارسال شده',
      delivered: 'تحویل شده',
      cancelled: 'لغو شده',
    };
    return texts[status] || status;
  };

  const toPersianDate = (isoDate) => {
    if (!isoDate) return '—';
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(date);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <div className="text-center py-8 text-gray-600 dark:text-gray-400">در حال بارگذاری...</div>;

  return (
    <div className="orders-page container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">سفارشات من</h1>

      {success && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-lg mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="جستجوی شماره سفارش..."
            value={searchTerm}
            onChange={handleSearch}
            className="input-field"
          />
        </div>
        <div className="md:w-64">
          <select
            value={filterStatus}
            onChange={handleStatusFilter}
            className="w-full border border-gray-200 dark:border-dark-border rounded-lg p-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">هیچ سفارشی با این شرایط یافت نشد</p>
          {filterStatus !== 'all' || searchTerm ? (
            <button
              onClick={() => { setFilterStatus('all'); setSearchTerm(''); }}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              حذف فیلترها
            </button>
          ) : (
            <Link to="/products" className="btn-primary inline-block">شروع خرید</Link>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card bg-white dark:bg-dark-surface overflow-hidden">
                <div className="border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">شماره سفارش:</span>
                    <span className="mr-2 font-mono text-gray-900 dark:text-white">
                      {order.order_number || order.id.slice(0, 8)}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">تاریخ:</span>
                    <span className="mr-2 text-gray-900 dark:text-white">{toPersianDate(order.created_at)}</span>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  {order.items && order.items.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                          <div>
                            <span className="font-medium">{item.product_name || item.product?.name}</span>
                            <span className="text-gray-500 dark:text-gray-400 mr-2">× {item.quantity}</span>
                          </div>
                          <span>{formatPrice(item.unit_price || item.price)}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">و {order.items.length - 3} محصول دیگر...</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">جزئیات محصولات در صفحه سفارش قابل مشاهده است</div>
                  )}

                  <div className="border-t border-gray-200 dark:border-dark-border pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">مبلغ کل:</span>
                      <span className="mr-2 text-xl text-primary-600 dark:text-primary-400 font-bold">
                        {formatPrice(order.total || order.total_amount)}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        to={`/orders/${order.id}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                      >
                        مشاهده جزئیات
                      </Link>
                      {order.status === 'pending' && !order.cancelled && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          className="text-red-600 dark:text-red-400 hover:underline text-sm disabled:opacity-50"
                        >
                          {cancellingId === order.id ? 'در حال لغو...' : 'لغو سفارش'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 dark:border-dark-border rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg transition"
              >
                قبلی
              </button>
              <span className="px-3 py-1 text-gray-700 dark:text-gray-300">
                صفحه {currentPage} از {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-200 dark:border-dark-border rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg transition"
              >
                بعدی
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;