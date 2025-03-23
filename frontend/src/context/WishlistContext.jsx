import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

const WishlistContext = createContext();

export const WishlistProvider = ({ children, user }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Debug user object whenever it changes
  useEffect(() => {
    console.log("WishlistProvider - User object changed:", user);
    if (user) {
      console.log("User properties:", Object.keys(user));
      console.log("User ID:", user.id);
      console.log("User userId:", user.userId);
    }
  }, [user]);

  useEffect(() => {
    console.log("User object in WishlistProvider:", user); // Debugging
    if (user && (user.userId || user.id)) {
      fetchWishlistItems(getUserId(user));
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  useEffect(() => {
    // Update wishlist count whenever wishlist items change
    setWishlistCount(wishlistItems.length);
  }, [wishlistItems]);

  // Helper function to safely get user ID
  const getUserId = (userObj) => {
    if (!userObj) {
      console.log("getUserId: User object is null or undefined");
      return null;
    }
    
    console.log("getUserId: User object keys:", Object.keys(userObj));
    
    // Try to get userId from different possible locations
    let id = null;
    
    // Direct properties
    if (userObj.userId) {
      id = userObj.userId;
      console.log("getUserId: Found userId property:", id);
    } else if (userObj.id) {
      id = userObj.id;
      console.log("getUserId: Found id property:", id);
    } 
    // Check if it's in a nested user object
    else if (userObj.user && (userObj.user.userId || userObj.user.id)) {
      id = userObj.user.userId || userObj.user.id;
      console.log("getUserId: Found ID in nested user object:", id);
    }
    // If we still don't have an ID, look for any property that might contain 'id'
    else {
      for (const key of Object.keys(userObj)) {
        if (key.toLowerCase().includes('id') && userObj[key]) {
          id = userObj[key];
          console.log(`getUserId: Found potential ID in property ${key}:`, id);
          break;
        }
      }
    }
    
    if (!id) {
      console.log("getUserId: Could not find any ID property in the user object");
    }
    
    return id;
  };

  const fetchWishlistItems = async (userId) => {
    if (!userId) {
      console.error("Cannot fetch wishlist: User ID is missing");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/wishlist/user/${userId}`);
      const data = await response.json();
      if (response.ok) {
        console.log("Fetched wishlist items:", data); // Debugging
        setWishlistItems(data);
      } else {
        console.error('Failed to fetch wishlist items:', data.message || data);
      }
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
    }
  };

  const addToWishlist = async (product) => {
    try {
      console.log("addToWishlist called with product:", product);
      console.log("Current user object:", user);
      
      // Get the user ID, ensuring we have a valid one
      let userId = getUserId(user);
      console.log("User ID for wishlist operation:", userId);
      
      // If we still couldn't find a user ID, use a default one for testing
      if (!userId) {
        console.warn("No user ID found, using default ID 1 for testing");
        userId = 1; // Use a default user ID that exists in your database
      }

      if (!product || (!product.id && !product.productId)) {
        console.error("Product information is missing or invalid");
        throw new Error("Product information is missing or invalid");
      }

      // Ensure we have a valid product ID
      const productId = product.productId || product.id;
      console.log("Product ID for wishlist operation:", productId);

      // Check if the item is already in the wishlist
      const isAlreadyInWishlist = await isInWishlist(productId);
      if (isAlreadyInWishlist) {
        console.log("Product already in wishlist, skipping add");
        return;
      }

      // Create the wishlist item with proper structure
      const wishlistItem = {
        user: {
          userId: userId
        },
        product: {
          productId: productId,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl
        }
      };

      console.log("Sending wishlist item to backend:", wishlistItem);

      const response = await axios.post(`http://localhost:8080/api/wishlist`, wishlistItem);
      console.log("Wishlist add response:", response.data);

      // Refresh the wishlist after adding
      fetchWishlistItems(userId);
      return response.data;
    } catch (error) {
      console.error("Error adding to wishlist:", error.response?.data || error.message);
      throw error;
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      const userId = getUserId(user);
      if (!userId) {
        console.error("Cannot remove from wishlist: User ID is missing");
        return;
      }

      const productId = wishlistItems.find(item => item.wishlistId === wishlistId)?.product?.productId;
      if (!productId) {
        console.error("Cannot remove from wishlist: Product ID is missing");
        return;
      }

      await removeByUserAndProduct(productId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const removeByUserAndProduct = async (productId) => {
    try {
      const userId = getUserId(user);
      if (!userId) {
        console.error("Cannot remove from wishlist: User ID is missing");
        return;
      }

      if (!productId) {
        console.error("Cannot remove from wishlist: Product ID is missing");
        return;
      }

      console.log(`Removing product ${productId} from wishlist for user ${userId}`);

      const response = await fetch(`http://localhost:8080/api/wishlist/user/${userId}/product/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => {
            const itemProductId = item.product.productId || item.product.id;
            return itemProductId !== productId;
          })
        );
      } else {
        const data = await response.json();
        console.error('Failed to remove from wishlist:', data.message || data);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = async (productId) => {
    if (!productId || !wishlistItems || wishlistItems.length === 0) return false;
    
    return wishlistItems.some((item) => {
      const itemProductId = item.product.productId || item.product.id;
      return itemProductId === productId;
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        removeByUserAndProduct,
        isInWishlist,
        user,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);