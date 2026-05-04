import { useState, useEffect, useContext, createContext } from 'react';
import CartService from '../services/CartService';
import { useAuth } from './useAuth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await CartService.getCurrentCart();
      setCart(response);
    } catch (err) {
      setError(err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (itemData) => {
    try {
      setLoading(true);
      const response = await CartService.addItem(itemData);
      setCart(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemData) => {
    try {
      setLoading(true);
      const response = await CartService.updateItem(itemData);
      setCart(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemData) => {
    try {
      setLoading(true);
      const response = await CartService.removeItem(itemData);
      setCart(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await CartService.clearCart();
      setCart(null);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (couponData) => {
    try {
      setLoading(true);
      const response = await CartService.applyCoupon(couponData);
      setCart(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCartItemsCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    if (!cart) return 0;
    return cart.total_amount || 0;
  };

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    applyCoupon,
    getCartItemsCount,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};