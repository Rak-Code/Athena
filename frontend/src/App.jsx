import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

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
  const [user, setUser] = useState({
    // Temporary mock user for testing admin panel
    // Remove this in production
    username: "Admin",
    role: "ADMIN"
  }); // Store user data including role

  const handleLoginSuccess = (userData) => {
    setUser(userData); // Set the logged-in user with role
  };

  return (
    <CartProvider>
      <Router>
        <NavigationBar setSearchTerm={setSearchTerm} user={user} onLoginSuccess={handleLoginSuccess} />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/cart" element={<Cart />} />
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
    </CartProvider>
  );
};

export default App;