import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('sontra_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [lang, setLang] = useState(() => localStorage.getItem('sontra_lang') || 'vi');
  const [currency, setCurrency] = useState(() => localStorage.getItem('sontra_curr') || 'VND');
  
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sontra_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('sontra_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sontra_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('sontra_curr', currency);
  }, [currency]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sontra_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sontra_user');
    }
  }, [user]);

  const addToCart = (product, quantity = 1, isGiftBox = false, cardMessage = '', boxSize = 'Small', giftItems = null) => {
    setCart((prevCart) => {
      if (!isGiftBox) {
        const existingIndex = prevCart.findIndex(item => item.productId === product.id && !item.isGiftBox);
        if (existingIndex > -1) {
          const newCart = [...prevCart];
          newCart[existingIndex].quantity += quantity;
          return newCart;
        }
      }

      if (isGiftBox) {
        const giftItemsStr = JSON.stringify(giftItems);
        const existingIndex = prevCart.findIndex(item => 
          item.productId === product.id && 
          item.isGiftBox && 
          item.cardMessage === cardMessage && 
          item.boxSize === boxSize && 
          JSON.stringify(item.giftItems) === giftItemsStr
        );
        if (existingIndex > -1) {
          const newCart = [...prevCart];
          newCart[existingIndex].quantity += quantity;
          return newCart;
        }
      }

      return [...prevCart, {
        productId: product.id,
        name: product.name,
        nameEN: product.nameEN,
        slug: product.slug,
        priceVND: product.priceVND,
        priceUSD: product.priceUSD,
        imageURL: product.imageURL,
        quantity,
        isGiftBox,
        cardMessage,
        boxSize,
        giftItems,
        isGiftBoxShell: product.isGiftBoxShell
      }];
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const newCart = [...prev];
      newCart[index].quantity = newQty;
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  const logout = () => setUser(null);

  const formatPrice = (vnd, usd) => {
    if (currency === 'USD') {
      return `$${usd.toFixed(2)}`;
    }
    return `${vnd.toLocaleString('vi-VN')} đ`;
  };

  const t = (vi, en) => {
    return lang === 'vi' ? vi : en;
  };

  return (
    <AppContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      lang,
      setLang,
      currency,
      setCurrency,
      user,
      setUser,
      logout,
      formatPrice,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
