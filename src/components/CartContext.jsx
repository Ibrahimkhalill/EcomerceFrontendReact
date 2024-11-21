// CartContext.js
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(0);
  const [wislistItem, setWislistItem] = useState(0);

  const value = {
    cartItems,
    setCartItems,
    wislistItem,
    setWislistItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
