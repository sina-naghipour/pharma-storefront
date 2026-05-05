import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const cartCount = getCartItemsCount();
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [showPromo, setShowPromo] = useState(true);

  return (
    <header className="sticky top-0 z-50">
      {/* Promo banner */}
      {showPromo && (
        <div className="bg-primary-600 text-white text-center py-2 text-sm flex justify-between items-center px-4">
          <span className="mx-auto">🎁 ارسال رایگان برای سفارش‌های بالای ۵۰۰,۰۰۰ تومان</span>
          <button onClick={() => setShowPromo(false)} className="text-white hover:text-gray-200">✕</button>
        </div>
      )}

      <div className="bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-border">
        <div className="container mx-auto px-4 py-4 md:py-5">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">
              داروخانه آنلاین
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition font-medium">
                محصولات
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/cart" className="relative">
                    <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 21v-6" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {/* User Dropdown - Click to open */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-600"
                    >
                      <span>{user?.first_name || user?.username || 'حساب کاربری'}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isUserDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-dark-surface rounded-lg shadow-lg border dark:border-dark-border z-50">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          پروفایل
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          سفارشات
                        </Link>
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            handleLogout();
                          }}
                          className="block w-full text-right px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-dark-bg"
                        >
                          خروج
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">ورود</Link>
                  <Link to="/register" className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition">
                    ثبت نام
                  </Link>
                </div>
              )}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t dark:border-dark-border">
              <div className="flex flex-col space-y-3">
                <Link to="/products" className="text-gray-700 dark:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>محصولات</Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/cart" className="text-gray-700 dark:text-gray-300 py-2 flex justify-between" onClick={() => setIsMenuOpen(false)}>
                      سبد خرید
                      {cartCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{cartCount}</span>}
                    </Link>
                    <Link to="/profile" className="text-gray-700 dark:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>پروفایل</Link>
                    <Link to="/orders" className="text-gray-700 dark:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>سفارشات</Link>
                    <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="text-right text-red-600 py-2">خروج</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-700 dark:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>ورود</Link>
                    <Link to="/register" className="bg-primary-600 text-white text-center py-2 rounded-lg" onClick={() => setIsMenuOpen(false)}>ثبت نام</Link>
                  </>
                )}
                <div className="py-2"><ThemeToggle /></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;