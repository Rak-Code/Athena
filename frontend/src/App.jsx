import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail"; // Ensure consistency
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

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Admin route wrapper component
  const AdminRoute = ({ children }) => {
    return (
      <AdminLayout>
        {children}
      </AdminLayout>
    );
  };

  return (
    <CartProvider>
      <Router>
        <NavigationBar setSearchTerm={setSearchTerm} />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/products/add" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
          <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminEditProduct /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          
          <Route path="*" element={<h1 className="text-center mt-5">404 - Page Not Found</h1>} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
