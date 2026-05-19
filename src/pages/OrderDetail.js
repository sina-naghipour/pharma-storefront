import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import OrderService from '../api/OrderService';
import { formatPrice } from '../utils/format';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getOrder(id);
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      paid: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      shipped: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'در انتظار پرداخت',
      paid: 'پرداخت شده',
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

  if (loading) return <div className="text-center py-8 text-gray-600 dark:text-gray-400">در حال بارگذاری...</div>;
  if (error) return <div className="text-center py-8 text-red-600 dark:text-red-400">خطا: {error}</div>;
  if (!order) return <div className="text-center py-8 text-gray-600 dark:text-gray-400">سفارش یافت نشد</div>;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-6">
        <Link to="/orders" className="text-primary-600 dark:text-primary-400 hover:underline transition">
          ← بازگشت به لیست سفارشات
        </Link>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap justify-between items-start gap-4 border-b border-gray-200 dark:border-dark-border pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">جزئیات سفارش</h1>
            <p className="text-gray-600 dark:text-gray-400">شماره سفارش: {order.order_number || order.id.slice(0, 8)}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">آدرس تحویل</h2>
            <div className="text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-border rounded-lg p-3 bg-gray-50 dark:bg-dark-bg">
              <p>{order.shipping_address?.recipient_name}</p>
              <p>{order.shipping_address?.street_address}</p>
              {order.shipping_address?.district && <p>{order.shipping_address.district}</p>}
              <p>{order.shipping_address?.city}, {order.shipping_address?.province}</p>
              <p>کد پستی: {order.shipping_address?.postal_code}</p>
              <p>تلفن: {order.shipping_address?.recipient_phone}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">اطلاعات سفارش</h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>تاریخ ثبت: {toPersianDate(order.created_at)}</p>
              <p>روش پرداخت: {order.payment_method_display || order.payment_method}</p>
              {order.tracking_number && <p>شماره پیگیری: {order.tracking_number}</p>}
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">محصولات</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-100 dark:bg-dark-bg">
              <tr className="border-b border-gray-200 dark:border-dark-border">
                <th className="p-2 font-semibold">نام محصول</th>
                <th className="p-2 font-semibold">تعداد</th>
                <th className="p-2 font-semibold">قیمت واحد</th>
                <th className="p-2 font-semibold">جمع</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map(item => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-dark-border">
                  <td className="p-2 text-gray-900 dark:text-white">{item.product_name}</td>
                  <td className="p-2 text-gray-900 dark:text-white">{item.quantity}</td>
                  <td className="p-2 text-gray-900 dark:text-white">{formatPrice(item.unit_price)}</td>
                  <td className="p-2 text-primary-600 dark:text-primary-400 font-medium">{formatPrice(item.unit_price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>جمع کل:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>تخفیف:</span>
                <span>-{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-dark-border pt-2 text-gray-900 dark:text-white">
              <span>قابل پرداخت:</span>
              <span className="text-primary-600 dark:text-primary-400">{formatPrice(order.total || order.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;