import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Initialize cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCart(parsedCart);
      updateCartCount(parsedCart);
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(cart);
  }, [cart]);

  const updateCartCount = (cartItems) => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  const addToCart = (product, variant, quantity) => {
    console.log("Adding to cart:", product);
    
    // Ensure we have a valid product ID
    const productId = parseInt(product.productId || product.id);
    if (!productId) {
      console.error("Invalid product ID:", product);
      return;
    }
    
    setCart(prevCart => {
      // Check if the item already exists in the cart
      const existingItemIndex = prevCart.findIndex(
        item => parseInt(item.productId) === productId && 
                item.variantSize === variant?.size && 
                item.variantColor === variant?.color
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item to cart
        console.log("Adding new item with productId:", productId);
        return [...prevCart, {
          productId: productId,
          name: product.name,
          price: parseFloat(product.price),
          imageUrl: product.imageUrl,
          variantSize: variant?.size || null,
          variantColor: variant?.color || null,
          quantity: parseInt(quantity)
        }];
      }
    });
  };

  const updateCartItem = (productId, newQuantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        parseInt(item.productId) === parseInt(productId) 
          ? { ...item, quantity: parseInt(newQuantity) } 
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => 
      prevCart.filter(item => parseInt(item.productId) !== parseInt(productId))
    );
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartCount, 
      addToCart, 
      updateCartItem, 
      removeFromCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);