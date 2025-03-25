import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import ReviewsSection from "../components/ReviewsSection";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState("");
  const { addToWishlist, removeByUserAndProduct, isInWishlist, user } = useWishlist();
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (!id) {
      console.error("Product ID is undefined in URL");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched product:", data); // Debugging
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  // Check if the product is in the user's wishlist
  useEffect(() => {
    console.log("User object in ProductDetail:", user); // Debugging
    if (product && user) {
      try {
        const productId = product.productId || product.id;
        console.log("Checking if product is in wishlist, productId:", productId);
        setInWishlist(isInWishlist(productId));
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        setInWishlist(false);
      }
    }
  }, [product, isInWishlist, user]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setMessage("Please select a size");
      return;
    }

    setAddingToCart(true);
    console.log("Adding product to cart:", product);
    console.log("Product ID:", product.productId || product.id);
    
    const variant = { size: selectedSize };
    addToCart({
      ...product,
      productId: product.productId || product.id // Ensure we have the product ID
    }, variant, quantity);
    
    setMessage("Added to cart!");
    setAddingToCart(false);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleWishlist = () => {
    console.log("handleWishlist called, user:", user);
    if (user) {
      console.log("User properties:", Object.keys(user));
      console.log("User ID:", user.id);
      console.log("User userId:", user.userId);
    }
    
    // Check if user is logged in - only check if user exists, not the ID properties
    if (!user) {
      console.log("User not logged in");
      setMessage("Please log in to use the wishlist feature");
      return;
    }

    setAddingToWishlist(true);
    try {
      const productId = product.productId || product.id;
      console.log("Handling wishlist for product ID:", productId);
      
      if (inWishlist) {
        // Use removeByUserAndProduct instead of removeFromWishlist
        removeByUserAndProduct(productId);
        setInWishlist(false);
        setMessage("Removed from wishlist!");
      } else {
        // Create a complete product object to ensure all required fields are present
        const productToAdd = {
          id: product.id,
          productId: product.productId || product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          description: product.description
        };
        
        console.log("Adding product to wishlist:", productToAdd);
        addToWishlist(productToAdd);
        setInWishlist(true);
        setMessage("Added to wishlist!");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setMessage("Failed to update wishlist. Please try again.");
    }
    setAddingToWishlist(false);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) return <p className="text-center text-gray-500 text-lg">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      {product ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          {/* Product Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full rounded-xl shadow-lg object-cover transform transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-3xl font-semibold text-gray-900">₹{product.price}</p>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 text-lg">Size:</label>
              <div className="flex gap-3">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-full text-sm font-medium transition-all duration-300 
                      ${selectedSize === size 
                        ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                      } focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 text-lg">Quantity:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
                >
                  -
                </button>
                <span className="px-4 py-1 border border-gray-300 rounded-lg text-gray-700">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-pill text-sm font-semibold transition-all duration-300 shadow-md
                  ${inWishlist 
                    ? "bg-red-500 text-white hover:bg-red-600" 
                    : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  } ${addingToWishlist ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleWishlist}
                disabled={addingToWishlist}
              >
                <FaHeart className="text-lg" />
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>

              <button
                className={`flex-1 px-6 py-3 rounded-pill text-sm font-semibold bg-dark text-white hover:bg-gray-800 transition-all duration-300 shadow-md
                  ${addingToCart ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            {/* Feedback Message */}
            {message && (
              <p
                className={`text-center py-2 px-4 rounded-pill text-sm font-medium
                  ${message.includes("Added") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500 text-lg">Product not found!</p>
      )}

      {/* Reviews Section */}
      <ReviewsSection productId={id} />

      <Footer />
    </div>
  );
};

export default ProductDetail;