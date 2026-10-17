import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";

const GUEST_KEY = "cart:guest";

const readCart = (key) => {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const clamp = (qty, stock) => Math.max(1, Math.min(qty, stock));

const mergeCarts = (own, guest) => {
  let merged = own;
  for (const g of guest) {
    const existing = merged.find((i) => i._id === g._id);
    merged = existing
      ? merged.map((i) =>
        i._id === g._id ? { ...i, quantity: clamp(i.quantity + g.quantity, g.stock) } : i
      )
      : [...merged, g];
  }
  return merged;
};

export default function CartProvider({ children, userId }) {
  const storageKey = userId ? `cart:${userId}` : GUEST_KEY;

  const [items, setItems] = useState(() => {
    const own = readCart(storageKey);
    return userId ? mergeCarts(own, readCart(GUEST_KEY)) : own;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      /* storage unavailable, cart just won't persist */
    }
  }, [items, storageKey]);

  useEffect(() => {
    if (!userId) return;
    try {
      localStorage.removeItem(GUEST_KEY);
    } catch {
      /* ignore */
    }
  }, [userId]);

  const addItem = (product, qty = 1) =>
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, stock: product.stock, quantity: clamp(i.quantity + qty, product.stock) }
            : i
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: clamp(qty, product.stock),
        },
      ];
    });

  const updateQuantity = (id, qty) =>
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: clamp(qty, i.stock) } : i))
    );

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i._id !== id));
  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}