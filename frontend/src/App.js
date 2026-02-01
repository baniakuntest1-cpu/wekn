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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Kasir - Fullscreen Mode (with Navbar) */}
          <Route
            path="/kasir"
            element={
              <>
                <Navbar />
                <CashierPage />
              </>
            }
          />

          {/* Management Pages - Sidebar Layout */}
          <Route
            path="/"
            element={
              <SidebarLayout>
                <Dashboard />
              </SidebarLayout>
            }
          />
          <Route
            path="/products"
            element={
              <SidebarLayout>
                <ProductsPage />
              </SidebarLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <SidebarLayout>
                <ReportsPage />
              </SidebarLayout>
            }
          />
          <Route
            path="/pelanggan"
            element={
              <SidebarLayout>
                <CustomersPage />
              </SidebarLayout>
            }
          />
          <Route
            path="/shifts"
            element={
              <SidebarLayout>
                <ShiftPage />
              </SidebarLayout>
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
