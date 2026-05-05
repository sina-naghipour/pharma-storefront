import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-4">درباره ما</h3>
            <p className="text-gray-600 dark:text-gray-400">
              داروخانه آنلاین با هدف ارائه بهترین خدمات دارویی و بهداشتی به هموطنان عزیز تاسیس شده است.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">محصولات</Link></li>
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">درباره ما</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">تماس با ما</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-4">خدمات مشتریان</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">سوالات متداول</Link></li>
              <li><Link to="/returns" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">بازگرداندن کالا</Link></li>
              <li><Link to="/shipping" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">روش‌های ارسال</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-4">تماس با ما</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</li>
              <li>ایمیل: info@pharma.com</li>
              <li>آدرس: تهران، خیابان مثال، پلاک ۱۲۳</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-dark-border mt-8 pt-8 text-center text-gray-500 dark:text-gray-500">
          <p>&copy; 2024 داروخانه آنلاین. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;