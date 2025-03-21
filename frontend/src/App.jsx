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
  const [user, setUser] = useState(null); // Initialize user as null instead of a mock admin

  // Debug the user object when it changes
  useEffect(() => {
    console.log('App - User object updated:', user);
    if (user) {
      console.log('User properties:', Object.keys(user));
    }
  }, [user]);

  const handleLoginSuccess = (userData) => {
    console.log('Login successful, received user data:', userData);
    
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