import React, { useState } from 'react';

const ShiftModal = ({ isOpen, onClose, onOpenShift, onCloseShift, mode, activeShift }) => {
  const [cashierName, setCashierName] = useState('');
  const [openingCash, setOpeningCash] = useState('');
  const [actualCash, setActualCash] = useState('');

  const handleOpenShift = () => {
    if (!cashierName.trim()) {
      alert('Nama kasir harus diisi!');
      return;
    }
    
    const opening = parseFloat(openingCash) || 0;
    if (opening < 0) {
      alert('Modal awal tidak valid!');
      return;
    }

    onOpenShift({
      cashier_name: cashierName,
      opening_cash: opening
    });

    // Reset
    setCashierName('');
    setOpeningCash('');
  };

  const handleCloseShift = () => {
    const actual = parseFloat(actualCash);
    
    if (isNaN(actual) || actual < 0) {
      alert('Jumlah cash aktual tidak valid!');
      return;
    }

    onCloseShift({
      actual_cash: actual
    });

    setActualCash('');
  };

  if (!isOpen) return null;

  // Note: expected_cash should be calculated on backend (opening_cash + cash_sales only)
  // For preview during input, we'll show a simplified calculation
  const expected = activeShift ? activeShift.opening_cash : 0;
  const discrepancy = actualCash ? parseFloat(actualCash) - expected : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="shift-modal">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        {mode === 'open' ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              🔓 Buka Shift
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800">
                💡 <strong>Info:</strong> Buka shift sebelum memulai transaksi. Modal awal adalah uang yang ada di laci kasir.
              </p>
            </div>

            {/* Cashier Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nama Kasir: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                data-testid="shift-cashier-name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                placeholder="Masukkan nama kasir"
                autoFocus
              />
            </div>

            {/* Opening Cash */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Modal Awal (Rp):
              </label>
              <input
                type="number"
                value={openingCash}
                onChange={(e) => setOpeningCash(e.target.value)}
                data-testid="shift-opening-cash"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-xl font-bold text-center"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">Jumlah uang tunai di laci kasir saat ini</p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleOpenShift}
                data-testid="confirm-open-shift"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg"
              >
                🔓 Buka Shift
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              🔒 Tutup Shift
            </h2>

            {/* Shift Summary */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Ringkasan Shift:</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Kasir:</span>
                  <span className="font-semibold">{activeShift?.cashier_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Modal Awal:</span>
                  <span className="font-semibold">Rp {(activeShift?.opening_cash || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Penjualan:</span>
                  <span className="font-semibold text-green-600">Rp {(activeShift?.total_sales || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah Transaksi:</span>
                  <span className="font-semibold">{activeShift?.total_transactions || 0}</span>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Petunjuk:</strong> Hitung semua uang tunai di laci kasir. Sistem akan menghitung cash yang diharapkan berdasarkan modal awal + penjualan tunai selama shift ini.
              </p>
            </div>

            {/* Actual Cash Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Cash Aktual (Rp): <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={actualCash}
                onChange={(e) => setActualCash(e.target.value)}
                data-testid="shift-actual-cash"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xl font-bold text-center"
                placeholder="0"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">Hitung uang tunai yang ada di laci kasir</p>
            </div>

            {/* Note: Actual discrepancy will be calculated on backend */}

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleCloseShift}
                data-testid="confirm-close-shift"
                disabled={!actualCash}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
              >
                🔒 Tutup Shift
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShiftModal;
