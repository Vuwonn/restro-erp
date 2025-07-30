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
import Settings from "./pages/admin/sidebarpage/Settings";
import AddMenuItem from "./pages/admin/menu/AddMenuItem";
import GuestOrder from "./components/custumer/GuestOrderPage";
import MenuPage from "./pages/admin/sidebarpage/Menu";
import GuestOrderPage from "./components/custumer/GuestOrderPage";
import GuestUserDashboard from "./pages/user/GuestUserDashboard";
import ActiveOrder from "./components/custumer/ActiveOrder";
import OrderDetails from "./pages/admin/sidebarpage/OrderDetails";
import TableManager from "./pages/admin/sidebarpage/TableStats";
import Data from "./pages/admin/sidebarpage/Data";
import RoomManager from "./pages/admin/sidebarpage/RoomStats";
import AdminPOSPage from "./pages/admin/sidebarpage/AdminPOSPage";
import CheckoutPage from "./pages/admin/sidebarpage/Checkout";
import Reports from "./pages/admin/sidebarpage/Reports";
import RoomsList from "./pages/user/RoomList";
import RoomDetails from "./pages/user/RoomDetails";
import AdminRoomBookings from "./pages/admin/sidebarpage/RoomReservations";
import GetTotalByPaymentType from "./pages/admin/sidebarpage/GetTotalByPaymentType";

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
        <Route path="/active-orders" element={<ActiveOrder />} />
        <Route path="/rooms" element={<RoomsList />} />
        <Route path="/rooms/:roomNumber" element={<RoomDetails />} />
        


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
          <Route path="orders/:tableNumber" element={<OrderDetails />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="staff" element={<Staff />} />
          <Route path="reports" element={<Reports />} />
          <Route path="table-stats" element={<TableManager />} />
          <Route path="room-stats" element={<RoomManager />} />
          <Route path="reservations" element={<AdminRoomBookings />} />
          <Route path="pos" element={<AdminPOSPage />} />
          <Route path="pos/checkout" element={<CheckoutPage />} />
          <Route path="get-total" element={<GetTotalByPaymentType />} />
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
