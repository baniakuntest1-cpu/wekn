import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SidebarLayout from "./layouts/SidebarLayout";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CashierPage from "./pages/CashierPage";
import ProductsPage from "./pages/ProductsPage";
import ReportsPage from "./pages/ReportsPage";
import CustomersPage from "./pages/CustomersPage";
import ShiftPage from "./pages/ShiftPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/kasir" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Kasir - Fullscreen Mode (with Navbar) - All roles */}
          <Route
            path="/kasir"
            element={
              <ProtectedRoute>
                <Navbar />
                <CashierPage />
              </ProtectedRoute>
            }
          />

          {/* Management Pages - Sidebar Layout - Super Admin Only */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SidebarLayout>
                  <Dashboard />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SidebarLayout>
                  <ProductsPage />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SidebarLayout>
                  <ReportsPage />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pelanggan"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SidebarLayout>
                  <CustomersPage />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shifts"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SidebarLayout>
                  <ShiftPage />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SidebarLayout>
                  <UsersPage />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect old routes */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
