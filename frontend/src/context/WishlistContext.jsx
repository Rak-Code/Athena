import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children, user }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistMap, setWishlistMap] = useState({});  // Map to store product ID to wishlist ID mapping

  // Debug the user object
  useEffect(() => {
    console.log('WishlistProvider - User object:', user);
    if (user) {
      console.log('User properties:', Object.keys(user));
      console.log('User ID type:', typeof user.id);
      console.log('User ID value:', user.id);
      console.log('User userId type:', typeof user.userId);
      console.log('User userId value:', user.userId);
    }
  }, [user]);

  // Load wishlist from local storage or API when component mounts
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setWishlistCount(0);
      setWishlistMap({});
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching wishlist for user:', user.id);
      
      const response = await axios.get(`http://localhost:8080/api/wishlist/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Raw wishlist response:', response.data);
      
      // Process the response data
      const items = [];
      const idMap = {};
      
      // The response contains Wishlist objects with product information
      response.data.forEach(item => {
        console.log('Processing wishlist item:', item);
        if (item.product) {
          console.log('Product in wishlist:', item.product);
          items.push(item.product);
          // Use productId instead of id
          idMap[item.product.productId] = item.wishlistId;
        }
      });
      
      console.log('Processed wishlist items:', items);
      console.log('Wishlist ID map:', idMap);
      
      setWishlistItems(items);
      setWishlistMap(idMap);
      setWishlistCount(items.length);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Set empty wishlist on error
      setWishlistItems([]);
      setWishlistCount(0);
      setWishlistMap({});
    }
  };

  const addToWishlist = async (product) => {
    if (!user) {
      console.error('User not logged in');
      return;
    }
    
    try {
      console.log('Adding product to wishlist:', product);
      console.log('User object:', user);
      
      // Determine the correct product ID (could be either productId or id)
      const productId = product.productId || product.id;
      
      if (!productId) {
        console.error('Product ID is missing:', product);
        return;
      }
      
      // Get the user ID using the helper function
      const userId = getUserId();
      
      if (!userId) {
        console.error('User ID is missing, cannot add to wishlist');
        return;
      }
      
      console.log('Using User ID:', userId, 'Product ID:', productId);
      
      // Create a wishlist item with user and product references
      const wishlistItem = {
        user: { userId: userId },
        product: { productId: productId }
      };
      
      console.log('Sending wishlist item to backend:', wishlistItem);
      
      const response = await axios.post('http://localhost:8080/api/wishlist', wishlistItem, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Wishlist response:', response.data);
      
      // Update local state
      const newWishlistMap = { ...wishlistMap };
      newWishlistMap[productId] = response.data.wishlistId;
      
      // Add the product to the wishlist items with consistent ID property
      const productWithConsistentId = {
        ...product,
        productId: productId  // Ensure productId is always set
      };
      
      setWishlistItems([...wishlistItems, productWithConsistentId]);
      setWishlistMap(newWishlistMap);
      setWishlistCount(wishlistCount + 1);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      
      // Log more detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) {
      console.error('User not logged in');
      return;
    }
    
    // Get the wishlist ID for this product
    const wishlistId = wishlistMap[productId];
    
    if (!wishlistId) {
      console.error('Wishlist item not found for product:', productId);
      return;
    }
    
    try {
      console.log('Removing from wishlist, productId:', productId, 'wishlistId:', wishlistId);
      
      await axios.delete(`http://localhost:8080/api/wishlist/${wishlistId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local state
      const updatedItems = wishlistItems.filter(item => item.productId !== productId);
      const updatedMap = { ...wishlistMap };
      delete updatedMap[productId];
      
      setWishlistItems(updatedItems);
      setWishlistMap(updatedMap);
      setWishlistCount(updatedItems.length);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (productId) => {
    if (!user || !wishlistItems.length) return false;
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = async () => {
    if (!user) {
      console.error('User not logged in');
      return;
    }
    
    try {
      console.log('Clearing wishlist for user:', user);
      
      // Get the user ID (could be either userId or id)
      const userId = user.userId || user.id;
      
      if (!userId) {
        console.error('User ID is missing:', user);
        return;
      }
      
      // We need to delete each wishlist item individually
      const deletePromises = wishlistItems.map(item => {
        const itemId = item.productId || item.id;
        const wishlistId = wishlistMap[itemId];
        console.log('Deleting wishlist item:', item, 'wishlistId:', wishlistId);
        if (wishlistId) {
          return axios.delete(`http://localhost:8080/api/wishlist/${wishlistId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
        }
        return Promise.resolve(); // Skip if no wishlistId found
      });
      
      await Promise.all(deletePromises);
      
      // Update local state
      setWishlistItems([]);
      setWishlistMap({});
      setWishlistCount(0);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      
      // Log more detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      user
    }}>
      {children}
    </WishlistContext.Provider>
  );
};