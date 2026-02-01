import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShiftModal from '../components/ShiftModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ShiftPage = () => {
  const [shifts, setShifts] = useState([]);
  const [activeShift, setActiveShift] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('open'); // 'open' or 'close'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [shiftsRes, activeRes] = await Promise.all([
        axios.get(`${API}/shifts`),
        axios.get(`${API}/shifts/active`)
      ]);
      
      setShifts(shiftsRes.data);
      setActiveShift(activeRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      setLoading(false);
    }
  };

  const handleOpenShift = async (shiftData) => {
    try {
      await axios.post(`${API}/shifts/open`, shiftData);
      fetchData();
      setShowModal(false);
    } catch (error) {
      console.error('Error opening shift:', error);
      if (error.response?.status === 400) {
        alert(error.response.data.detail);
      } else {
        alert('Gagal membuka shift');
      }
    }
  };

  const handleCloseShift = async (closeData) => {
    try {
      await axios.post(`${API}/shifts/${activeShift.id}/close`, closeData);
      fetchData();
      setShowModal(false);
    } catch (error) {
      console.error('Error closing shift:', error);
      alert('Gagal menutup shift');
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();
    const diff = endTime - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div data-testid="shift-page">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">💵 Manajemen Shift & Kas</h1>
            <p className="text-sm text-gray-600 mt-1">
              Kelola shift kasir dan lacak cash flow
            </p>
          </div>
          
          {activeShift ? (
            <button
              onClick={() => {
                setModalMode('close');
                setShowModal(true);
              }}
              data-testid="close-shift-button"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-3 rounded-lg shadow"
            >
              🔒 Tutup Shift
            </button>
          ) : (
            <button
              onClick={() => {
                setModalMode('open');
                setShowModal(true);
              }}
              data-testid="open-shift-button"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-3 rounded-lg shadow"
            >
              🔓 Buka Shift
            </button>
          )}
        </div>
      </div>

      {/* Active Shift Banner */}
      {activeShift && (
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg p-6 mb-4">
          <h2 className="text-xl font-bold mb-3">🟢 Shift Aktif</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-green-100 text-sm">Kasir</p>
              <p className="font-bold text-lg">{activeShift.cashier_name}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Modal Awal</p>
              <p className="font-bold text-lg">Rp {(activeShift.opening_cash || 0).toLocaleString('id-ID')}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Durasi</p>
              <p className="font-bold text-lg">{formatDuration(activeShift.opening_time)}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Dibuka</p>
              <p className="font-bold text-lg">{formatDateTime(activeShift.opening_time)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Shift History */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Riwayat Shift</h2>
        
        {shifts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">💵</div>
            <p className="text-xl mb-2">Belum ada riwayat shift</p>
            <p className="text-sm">Buka shift pertama untuk mulai</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className={`border-2 rounded-lg p-4 ${shift.status === 'open' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      {shift.cashier_name}
                      {shift.status === 'open' && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Aktif</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(shift.opening_time)}
                      {shift.closing_time && ` - ${formatDateTime(shift.closing_time)}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      Durasi: {formatDuration(shift.opening_time, shift.closing_time)}
                    </p>
                  </div>
                  
                  {shift.status === 'closed' && shift.discrepancy !== undefined && (
                    <div className={`text-right ${shift.discrepancy === 0 ? 'text-green-600' : shift.discrepancy > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      <p className="text-xs">Selisih</p>
                      <p className="font-bold">
                        {shift.discrepancy === 0 ? '✅ Pas' : shift.discrepancy > 0 ? `+ Rp ${Math.abs(shift.discrepancy).toLocaleString('id-ID')}` : `- Rp ${Math.abs(shift.discrepancy).toLocaleString('id-ID')}`}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div className="bg-white rounded p-2">
                    <p className="text-gray-600 text-xs">Modal Awal</p>
                    <p className="font-semibold">Rp {(shift.opening_cash || 0).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-gray-600 text-xs">Total Penjualan</p>
                    <p className="font-semibold text-green-600">Rp {(shift.total_sales || 0).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-gray-600 text-xs">Transaksi</p>
                    <p className="font-semibold">{shift.total_transactions || 0}x</p>
                  </div>
                  {shift.status === 'closed' && (
                    <>
                      <div className="bg-white rounded p-2">
                        <p className="text-gray-600 text-xs">Diharapkan</p>
                        <p className="font-semibold text-orange-600">Rp {(shift.expected_cash || 0).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="bg-white rounded p-2">
                        <p className="text-gray-600 text-xs">Aktual</p>
                        <p className="font-semibold text-blue-600">Rp {(shift.actual_cash || 0).toLocaleString('id-ID')}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shift Modal */}
      <ShiftModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onOpenShift={handleOpenShift}
        onCloseShift={handleCloseShift}
        mode={modalMode}
        activeShift={activeShift}
      />
    </div>
  );
};

export default ShiftPage;
