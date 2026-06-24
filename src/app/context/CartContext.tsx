import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Book, Teaching, CartContextType } from '../lib/types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('atalanka_cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('atalanka_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Book | Teaching, type: 'book' | 'teaching') => {
    setItems(prev => {
      const existingItem = prev.find(i => i.item.id === item.id && i.type === type);

      if (existingItem) {
        return prev;
      }

      return [...prev, { id: `${type}-${item.id}`, type, item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity: 1 } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => {
    const price = 'price' in item.item ? item.item.price : 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
