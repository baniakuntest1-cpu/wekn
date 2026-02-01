import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ReportsPage = () => {
  const [dailyReport, setDailyReport] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [dailyRes, lowStockRes] = await Promise.all([
        axios.get(`${API}/reports/daily`),
        axios.get(`${API}/reports/products/low-stock?threshold=10`)
      ]);
      
      setDailyReport(dailyRes.data);
      setLowStockProducts(lowStockRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div data-testid="reports-page">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-3 mb-3">
          <h1 className="text-2xl font-bold text-gray-800" data-testid="reports-title">
            📊 Laporan Penjualan
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            {dailyReport && formatDate(dailyReport.date)}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-4 text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-green-100 text-sm">Total Penjualan</span>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-2xl font-bold" data-testid="total-sales">
              Rp {dailyReport?.total_sales?.toLocaleString('id-ID') || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-4 text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-blue-100 text-sm">Jumlah Transaksi</span>
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-2xl font-bold" data-testid="total-transactions">
              {dailyReport?.total_transactions || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-4 text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-purple-100 text-sm">Rata-rata/Transaksi</span>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-2xl font-bold" data-testid="average-transaction">
              Rp {dailyReport?.average_transaction?.toLocaleString('id-ID', {maximumFractionDigits: 0}) || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          {/* Product Sales */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              🍞 Penjualan per Produk
            </h2>
            {dailyReport?.product_sales && dailyReport.product_sales.length > 0 ? (
              <div className="space-y-2">
                {dailyReport.product_sales
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.product_name}</p>
                        <p className="text-xs text-gray-600">Terjual: {item.quantity} pcs</p>
                      </div>
                      <p className="font-bold text-orange-600 text-sm">
                        Rp {item.revenue.toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Belum ada penjualan hari ini</p>
            )}
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              ⚠️ Stok Menipis
            </h2>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center bg-red-50 border border-red-200 rounded-lg p-4">
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">Stok: {product.stock}</p>
                      <p className="text-xs text-gray-500">Segera isi ulang</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">✅ Semua stok aman</p>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📋 Riwayat Transaksi Hari Ini
          </h2>
          {dailyReport?.transactions && dailyReport.transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Waktu</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID Transaksi</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kasir</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyReport.transactions.map((trans) => (
                    <tr key={trans.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{formatTime(trans.timestamp)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{trans.id.substring(0, 8)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{trans.cashier_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{trans.items.length} item(s)</td>
                      <td className="px-4 py-3 text-sm font-semibold text-orange-600 text-right">
                        Rp {trans.total.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Belum ada transaksi hari ini</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;