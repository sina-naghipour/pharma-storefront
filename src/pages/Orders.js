import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderService from '../api/OrderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderService.getOrders();
      const ordersData = response.results || response;
      setOrders(ordersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'payment_processing': 'bg-blue-100 text-blue-800',
      'paid': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'pending': 'در انتظار پرداخت',
      'payment_processing': 'در حال پردازش پرداخت',
      'paid': 'پرداخت شده',
      'cancelled': 'لغو شده',
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

  if (loading) return <div className="text-center py-8">در حال بارگذاری...</div>;
  if (error) return <div className="text-center py-8 text-red-600">خطا: {error}</div>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">هیچ سفارشی ثبت نشده است</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          شروع خرید
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">سفارشات من</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="font-semibold">شماره سفارش:</span>
                <span className="mr-2 font-mono">
                  {order.order_number || order.id.slice(0, 8)}
                </span>   {/* ← show order_number, not id */}
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
              <div className="space-y-2">
                {order.items && order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{item.product_name || item.product?.name}</span>
                      <span className="text-gray-600 mr-2">× {item.quantity}</span>
                    </div>
                    <span>{(item.unit_price || item.price)?.toLocaleString()} تومان</span>
                  </div>
                ))}
                {order.items && order.items.length > 3 && (
                  <p className="text-gray-600">و {order.items.length - 3} محصول دیگر...</p>
                )}
              </div>

              <div className="border-t mt-4 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <span className="font-semibold">مبلغ کل:</span>
                  <span className="mr-2 text-xl text-blue-600 font-bold">
                    {(order.total || order.total_amount)?.toLocaleString()} تومان
                  </span>   {/* ← use order.total (from serializer) */}
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  className="mt-2 sm:mt-0 text-blue-600 hover:text-blue-800"
                >
                  مشاهده جزئیات
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;