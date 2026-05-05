import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTopButton from './components/ScrollToTopButton';
import Checkout from './pages/Checkout';
import OrderDetail from './pages/OrderDetail';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col" dir="rtl">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/category/:slug" element={<Products />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/orders/:id" element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                } />

                </Routes>
              </main>
              <Footer />
              <ScrollToTopButton />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;