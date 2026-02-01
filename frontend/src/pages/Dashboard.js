import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [dailyReport, setDailyReport] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dailyRes, lowStockRes] = await Promise.all([
        axios.get(`${API}/reports/daily`),
        axios.get(`${API}/reports/products/low-stock?threshold=10`)
      ]);
      
      setDailyReport(dailyRes.data);
      setLowStockProducts(lowStockRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div data-testid="dashboard-page">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-teal-500 rounded-xl shadow-lg p-8 mb-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Selamat Datang di WEEKN POS! 🍞</h1>
        <p className="text-lg opacity-90">Dashboard Overview - {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 font-semibold">Total Penjualan</span>
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            Rp {dailyReport?.total_sales?.toLocaleString('id-ID') || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Hari ini</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 font-semibold">Transaksi</span>
            <span className="text-3xl">📝</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {dailyReport?.total_transactions || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Transaksi hari ini</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 font-semibold">Rata-rata</span>
            <span className="text-3xl">📈</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            Rp {dailyReport?.average_transaction?.toLocaleString('id-ID', {maximumFractionDigits: 0}) || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Per transaksi</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 font-semibold">Stok Menipis</span>
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {lowStockProducts.length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Produk perlu restock</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            ⚡ Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/kasir"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-lg text-center transition-all shadow"
            >
              💰 Mulai Transaksi
            </Link>
            <Link
              to="/products"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-lg text-center transition-all shadow"
            >
              📦 Kelola Produk
            </Link>
            <Link
              to="/pelanggan"
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 rounded-lg text-center transition-all shadow"
            >
              👥 Data Pelanggan
            </Link>
            <Link
              to="/reports"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-lg text-center transition-all shadow"
            >
              📊 Lihat Laporan
            </Link>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🏆 Produk Terlaris Hari Ini
          </h2>
          {dailyReport?.product_sales && dailyReport.product_sales.length > 0 ? (
            <div className="space-y-3">
              {dailyReport.product_sales
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 5)
                .map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{item.product_name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} terjual</p>
                      </div>
                    </div>
                    <p className="font-bold text-orange-600">
                      Rp {item.revenue.toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Belum ada penjualan hari ini</p>
          )}
        </div>
      </div>

      {/* Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
            ⚠️ Peringatan Stok
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lowStockProducts.slice(0, 6).map((product) => (
              <div key={product.id} className="bg-white rounded-lg p-3 border border-red-200">
                <p className="font-semibold text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-red-600 font-bold mt-1">Stok: {product.stock}</p>
              </div>
            ))}
          </div>
          <Link
            to="/products"
            className="inline-block mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-all"
          >
            Kelola Stok →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
