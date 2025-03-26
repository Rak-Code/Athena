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
import OrderDetails from "./pages/user/OrderDetails";

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
  const [user, setUser] = useState(null);

  // Load user from localStorage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Loading user from localStorage:", parsedUser);
        
        // Validate user data structure
        if (!parsedUser || typeof parsedUser !== 'object') {
          throw new Error("Invalid user data structure");
        }
        
        // Ensure we have required fields
        if (!parsedUser.email) {
          throw new Error("Missing email in user data");
        }
        if (!parsedUser.userId) {
          throw new Error("Missing user ID");
        }
        
        // Normalize the user object structure
        const normalizedUser = {
          id: parsedUser.userId,
          userId: parsedUser.userId,
          username: parsedUser.username,
          email: parsedUser.email,
          role: parsedUser.role || "USER"
        };
        
        // Validate ID format
        if (isNaN(normalizedUser.userId)) {
          throw new Error("Invalid user ID format");
        }
        
        console.log("Normalized user data:", normalizedUser);
        setUser(normalizedUser);
        
        // Update localStorage with normalized data
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      } catch (error) {
        console.error("Error processing stored user data:", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  // Debug the user object when it changes
  useEffect(() => {
    console.log("App - User object updated:", user);
    if (user) {
      console.log("User properties:", Object.keys(user));
    }
  }, [user]);

  const handleLoginSuccess = (userData) => {
    console.log("Login successful, received user data:", userData);

    if (userData) {
      try {
        // Validate incoming user data
        if (!userData.email) {
          throw new Error("Missing email in user data");
        }
        if (!userData.userId) {
          throw new Error("Missing user ID");
        }

        // Normalize the user object structure
        const normalizedUser = {
          id: userData.userId,
          userId: userData.userId,
          username: userData.username,
          email: userData.email,
          role: userData.role || "USER"
        };

        // Validate ID format
        if (isNaN(normalizedUser.userId)) {
          throw new Error("Invalid user ID format");
        }

        console.log("Normalized user data:", normalizedUser);
        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      } catch (error) {
        console.error("Error processing user data:", error);
        setUser(null);
        localStorage.removeItem("user");
        throw error; // Re-throw to be handled by the login component
      }
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <CartProvider>
      <WishlistProvider user={user}>
        <Router>
          <NavigationBar
            setSearchTerm={setSearchTerm}
            user={user}
            onLoginSuccess={handleLoginSuccess}
          />
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Home searchTerm={searchTerm} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/my-profile" element={
              <ProtectedRoute user={user} requiredRole={null}>
                <MyProfile />
              </ProtectedRoute>
            } />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route
              path="/orders/:orderId"
              element={
                <ProtectedRoute user={user} requiredRole={null}>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />

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

            <Route
              path="*"
              element={<h1 className="text-center mt-5">404 - Page Not Found</h1>}
            />
          </Routes>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
};

export default App;