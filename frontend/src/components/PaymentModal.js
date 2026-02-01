import React, { useState } from 'react';

const PaymentModal = ({ isOpen, onClose, total, onConfirmPayment }) => {
  const [cashReceived, setCashReceived] = useState('');
  const [cashierName, setCashierName] = useState('Kasir');

  const cashAmount = parseFloat(cashReceived) || 0;
  const change = cashAmount - total;

  const handleConfirm = () => {
    if (cashAmount >= total) {
      onConfirmPayment({
        payment_method: 'cash',
        cash_received: cashAmount,
        change: change,
        cashier_name: cashierName
      });
      setCashReceived('');
    }
  };

  const quickAmounts = [
    50000, 100000, 150000, 200000, 500000
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="payment-modal">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center" data-testid="payment-modal-title">
          💵 Pembayaran
        </h2>

        <div className="bg-orange-50 rounded-lg p-4 mb-4">
          <p className="text-xs text-gray-600 mb-1">Total Belanja:</p>
          <p className="text-3xl font-bold text-orange-600" data-testid="payment-total">
            Rp {total.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nama Kasir:
          </label>
          <input
            type="text"
            value={cashierName}
            onChange={(e) => setCashierName(e.target.value)}
            data-testid="cashier-name-input"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
            placeholder="Masukkan nama kasir"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Uang Diterima:
          </label>
          <input
            type="number"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            data-testid="cash-received-input"
            className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xl font-bold text-center"
            placeholder="0"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setCashReceived(amount.toString())}
              data-testid={`quick-amount-${amount}`}
              className="bg-teal-100 hover:bg-teal-200 text-teal-800 font-semibold py-2 text-sm rounded-lg transition-all active:scale-95"
            >
              {amount >= 1000000 ? `${amount / 1000000}jt` : `${amount / 1000}rb`}
            </button>
          ))}
        </div>

        {cashAmount >= total && (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3 mb-4">
            <p className="text-xs text-green-700 mb-1">Kembalian:</p>
            <p className="text-2xl font-bold text-green-600" data-testid="payment-change">
              Rp {change.toLocaleString('id-ID')}
            </p>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={onClose}
            data-testid="payment-cancel-button"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-all text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            data-testid="payment-confirm-button"
            disabled={cashAmount < total}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Bayar & Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;