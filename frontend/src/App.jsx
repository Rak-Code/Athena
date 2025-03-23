import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Wishlist from "./components/Wishlist";
import MyProfile from "./pages/MyProfile";

// Admin imports
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminAddProduct from "./pages/admin/AddProduct";
import AdminEditProduct from "./pages/admin/EditProduct";
import AdminOrders from "./pages/admin/Orders";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null); // Initialize user as null

  // Clear localStorage on initial load to ensure a clean login state
  useEffect(() => {
    // Uncomment the next line to clear user data on every app load
    localStorage.removeItem('user');
    console.log('User data cleared from localStorage');
  }, []);

  // Load user from localStorage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Loaded user from localStorage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user'); // Remove invalid data
      }
    }
  }, []);

  // Debug the user object when it changes
  useEffect(() => {
    console.log('App - User object updated:', user);
    if (user) {
      console.log('User properties:', Object.keys(user));
    }
  }, [user]);

  const handleLoginSuccess = (userData) => {
    console.log('Login successful, received user data:', userData);
    
    if (userData) {
      // Ensure the user object has the correct structure for the wishlist
      const processedUserData = {
        ...userData,
        // If userData has userId but no id, add id property
        id: userData.id || userData.userId,
        // If userData has id but no userId, add userId property
        userId: userData.userId || userData.id
      };
      
      console.log('Processed user data:', processedUserData);
      setUser(processedUserData); // Set the logged-in user with role
      
      // Save user to localStorage for session persistence
      localStorage.setItem('user', JSON.stringify(processedUserData));
    } else {
      // User is logging out
      setUser(null);
      localStorage.removeItem('user'); // Remove user from localStorage
    }
  };

  return (
    <CartProvider>
      <WishlistProvider user={user}>
        <Router>
          <NavigationBar setSearchTerm={setSearchTerm} user={user} onLoginSuccess={handleLoginSuccess} />
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Home searchTerm={searchTerm} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute user={user} requiredRole="ADMIN">
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute user={user} requiredRole="ADMIN">
                  <AdminLayout>
                    <AdminProducts />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/add"
              element={
                <ProtectedRoute user={user} requiredRole="ADMIN">
                  <AdminLayout>
                    <AdminAddProduct />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <ProtectedRoute user={user} requiredRole="ADMIN">
                  <AdminLayout>
                    <AdminEditProduct />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute user={user} requiredRole="ADMIN">
                  <AdminLayout>
                    <AdminOrders />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<h1 className="text-center mt-5">404 - Page Not Found</h1>} />
          </Routes>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
};

export default App;