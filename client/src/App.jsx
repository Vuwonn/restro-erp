import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import NotFoundPage from "./pages/NotFoundPage";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminLayout from "./components/admin/AdminLayout";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CookLayout from "./components/cook/CookLayout";
import UserDashboard from "./pages/user/UserDashboard";
import CookDashboard from "./pages/cook/CookDashboard";

// Protected Routes
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import CookProtectedRoute from "./components/auth/CookProtectedRoute";
import Orders from "./pages/admin/sidebarpage/Orders";
import Inventory from "./pages/admin/sidebarpage/Inventory";
import Staff from "./pages/admin/sidebarpage/Staff";
import Reports from "./pages/admin/sidebarpage/Reports";
import Settings from "./pages/admin/sidebarpage/Settings";
import AddMenuItem from "./pages/admin/menu/AddMenuItem";
import GuestOrder from "./components/custumer/GuestOrderPage";
import MenuPage from "./pages/admin/sidebarpage/Menu";
import GuestOrderPage from "./components/custumer/GuestOrderPage";
import GuestUserDashboard from "./pages/user/GuestUserDashboard";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* User Panel - No Authentication Needed */}
        <Route path="/" element={<UserDashboard />} />

        {/* <Route path="/order" element={<GuestOrder />} /> */}
        <Route path="/guest-order" element={<GuestOrder />} />
        <Route path="/guest-checkout" element={<GuestOrderPage />} />
        <Route path="/order" element={<GuestUserDashboard />} />


        {/* Cook Panel - Protected Routes */}
        <Route
          path="/cook"
          element={
            <CookProtectedRoute>
              <CookLayout />
            </CookProtectedRoute>
          }
        >
          <Route index element={<CookDashboard />} />
        </Route>

        {/* Admin Panel - Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="dashboard/add" element={<AddMenuItem />} />
          <Route path="orders" element={<Orders />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="staff" element={<Staff />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
