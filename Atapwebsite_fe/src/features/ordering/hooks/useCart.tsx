"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/features/ordering/types/menu";

type CartContextValue = {
  items: CartItem[];
  orderNote: string;
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity: number, note: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  setOrderNote: (note: string) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "atap-ordering-cart";
const NOTE_STORAGE_KEY = "atap-ordering-note";

const CartContext = createContext<CartContextValue | null>(null);

function createCartItemId(productId: string, note: string) {
  return `${productId}:${note.trim().toLowerCase()}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderNote, setOrderNoteState] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedItems = window.localStorage.getItem(CART_STORAGE_KEY);
      const savedNote = window.localStorage.getItem(NOTE_STORAGE_KEY);

      if (savedItems) {
        setItems(JSON.parse(savedItems) as CartItem[]);
      }

      if (savedNote) {
        setOrderNoteState(savedNote);
      }
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [isReady, items]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(NOTE_STORAGE_KEY, orderNote);
  }, [isReady, orderNote]);

  const addItem = useCallback((product: Product, quantity: number, note: string) => {
    const normalizedNote = note.trim();
    const id = createCartItemId(product.id, normalizedNote);

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }

      return [...currentItems, { id, product, quantity, note: normalizedNote }];
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((currentItems) => {
      if (quantity <= 0) {
        return currentItems.filter((item) => item.id !== itemId);
      }

      return currentItems.map((item) => (item.id === itemId ? { ...item, quantity } : item));
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  }, []);

  const setOrderNote = useCallback((note: string) => {
    setOrderNoteState(note);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setOrderNoteState("");
    window.localStorage.removeItem(CART_STORAGE_KEY);
    window.localStorage.removeItem(NOTE_STORAGE_KEY);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

    return {
      items,
      orderNote,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      setOrderNote,
      clearCart,
    };
  }, [addItem, clearCart, items, orderNote, removeItem, setOrderNote, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
