import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState("");
  const { addToWishlist, removeFromWishlist, isInWishlist, user } = useWishlist();
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
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (product) {
      try {
        setInWishlist(isInWishlist(product.productId));
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        setInWishlist(false);
      }
    }
  }, [product, isInWishlist]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setMessage("Please select size and color");
      return;
    }

    setAddingToCart(true);
    const variant = { size: selectedSize, color: selectedColor };
    addToCart(product, variant, quantity);
    setMessage("Added to cart!");
    setAddingToCart(false);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleWishlist = () => {
    if (!user) {
      setMessage("Please log in to use the wishlist feature");
      return;
    }

    setAddingToWishlist(true);
    try {
      if (inWishlist) {
        removeFromWishlist(product.productId);
        setInWishlist(false);
        setMessage("Removed from wishlist!");
      } else {
        addToWishlist(product);
        setInWishlist(true);
        setMessage("Added to wishlist!");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setMessage("Please log in to use the wishlist feature");
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

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      {product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-10">
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-3/4 rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
            <p className="text-2xl text-gray-700 font-semibold mb-3">₹{product.price}</p>
            <p className="text-gray-600 mb-5">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Size:</label>
              <div className="flex gap-3">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedSize === size ? "bg-dark text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Color:</label>
              <div className="flex gap-3">
                {["Red", "Blue", "Black", "White"].map((color) => (
                  <button
                    key={color}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedColor === color ? "bg-dark text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Quantity:</label>
              <div className="flex items-center">
                <button
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-l-lg border"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-12 text-center border-gray-300 focus:border-blue-500"
                />
                <button
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-r-lg border"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-4">
              <button
                className={`rounded-pill shadow-sm px-6 py-3 transition ${
                  inWishlist ? 'bg-danger text-white' : 'bg-light text-dark border'
                } ${addingToWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleWishlist}
                disabled={addingToWishlist}
              >
                <FaHeart className="me-2 inline" /> 
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>

              <button
                className={`w-100 rounded-pill shadow-sm bg-dark text-white px-6 py-3 hover:bg-gray-800 transition ${
                  addingToCart ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>

            {message && (
              <p className={`text-center ${message.includes('Added') ? 'text-green-500' : 'text-red-500'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500">Product not found!</p>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetail;