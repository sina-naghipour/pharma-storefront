import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderService from '../api/OrderService';
import { formatPrice } from '../utils/format';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      setTotalPages(Math.ceil((response.count || response.length) / 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      payment_processing: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      preparing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  if (loading) return <div className="text-center py-8">در حال بارگذاری...</div>;
  if (error) return <div className="text-center py-8 text-red-600">خطا: {error}</div>;

  return (
    <div className="orders-page container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">سفارشات من</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="جستجوی شماره سفارش..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="md:w-64">
          <select
            value={filterStatus}
            onChange={handleStatusFilter}
            className="w-full border rounded-lg p-2"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">هیچ سفارشی با این شرایط یافت نشد</p>
          {filterStatus !== 'all' || searchTerm ? (
            <button
              onClick={() => { setFilterStatus('all'); setSearchTerm(''); }}
              className="text-blue-600 hover:text-blue-800"
            >
              حذف فیلترها
            </button>
          ) : (
            <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
              شروع خرید
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="border-b bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="font-semibold">شماره سفارش:</span>
                    <span className="mr-2 font-mono">{order.order_number || order.id.slice(0, 8)}</span>
                  </div>
                  <div>
                    <span className="font-semibold">تاریخ:</span>
                    <span className="mr-2">{toPersianDate(order.created_at)}</span>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  {/* Items section – only show if items exist */}
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{item.product_name || item.product?.name}</span>
                            <span className="text-gray-600 mr-2">× {item.quantity}</span>
                          </div>
                          <span>{formatPrice(item.unit_price || item.price)}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-gray-600">و {order.items.length - 3} محصول دیگر...</p>
                      )}
                    </div>
                  )}

                  <div className="border-t mt-4 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <span className="font-semibold">مبلغ کل:</span>
                      <span className="mr-2 text-xl text-blue-600 font-bold">
                        {formatPrice(order.total || order.total_amount)}
                      </span>
                    </div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="mt-2 sm:mt-0 text-blue-600 hover:text-blue-800"
                    >
                      مشاهده جزئیات
                    </Link>
                  </div>

                  {/* Cancel button – only if pending and cancellable */}
                  {order.status === 'pending' && order.can_cancel && (
                    <div className="mt-2 text-left">
                      <button
                        onClick={() => {/* implement cancel order */}}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        لغو سفارش
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                قبلی
              </button>
              <span className="px-3 py-1">
                صفحه {currentPage} از {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
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