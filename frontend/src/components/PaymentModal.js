import React, { useState } from 'react';

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: '💵', color: 'bg-green-100 hover:bg-green-200 text-green-800' },
  { id: 'qris', name: 'QRIS', icon: '📱', color: 'bg-blue-100 hover:bg-blue-200 text-blue-800' },
  { id: 'gopay', name: 'GoPay', icon: '🟢', color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800' },
  { id: 'ovo', name: 'OVO', icon: '🔵', color: 'bg-purple-100 hover:bg-purple-200 text-purple-800' },
  { id: 'dana', name: 'Dana', icon: '🟡', color: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800' },
  { id: 'shopeepay', name: 'ShopeePay', icon: '🟠', color: 'bg-orange-100 hover:bg-orange-200 text-orange-800' }
];

const PaymentModal = ({ isOpen, onClose, total, onConfirmPayment }) => {
  const [cashierName, setCashierName] = useState('Kasir');
  const [payments, setPayments] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [inputAmount, setInputAmount] = useState('');

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = total - totalPaid;
  const change = totalPaid > total ? totalPaid - total : 0;

  const handleAddPayment = () => {
    if (!selectedMethod || !inputAmount || parseFloat(inputAmount) <= 0) return;
    
    const amount = parseFloat(inputAmount);
    if (totalPaid + amount > total + 100000) return; // Prevent excessive overpayment
    
    setPayments([...payments, {
      method: selectedMethod.id,
      method_name: selectedMethod.name,
      amount: amount
    }]);
    
    setInputAmount('');
    setSelectedMethod(null);
  };

  const handleRemovePayment = (index) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleQuickAmount = (amount) => {
    if (remaining > 0) {
      setInputAmount(Math.min(amount, remaining + 50000).toString());
    }
  };

  const handleConfirm = () => {
    if (totalPaid < total) {
      alert('Total pembayaran kurang dari total belanja!');
      return;
    }

    const paymentMethods = payments.map(p => ({
      method: p.method,
      amount: p.amount
    }));

    // For backward compatibility with cash
    const cashPayment = payments.find(p => p.method === 'cash');
    
    onConfirmPayment({
      payment_methods: paymentMethods,
      cash_received: cashPayment ? cashPayment.amount : null,
      change: change,
      cashier_name: cashierName
    });
    
    // Reset
    setPayments([]);
    setInputAmount('');
    setSelectedMethod(null);
  };

  const quickAmounts = [20000, 50000, 100000, 150000, 200000];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="payment-modal">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center" data-testid="payment-modal-title">
          💳 Pembayaran
        </h2>

        {/* Total Belanja */}
        <div className="bg-orange-50 rounded-lg p-4 mb-4">
          <p className="text-xs text-gray-600 mb-1">Total Belanja:</p>
          <p className="text-3xl font-bold text-orange-600" data-testid="payment-total">
            Rp {total.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Kasir Name */}
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

        {/* Payment Methods Selection */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pilih Metode Pembayaran:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                className={`${method.color} ${selectedMethod?.id === method.id ? 'ring-2 ring-orange-500' : ''} font-semibold py-3 text-sm rounded-lg transition-all flex items-center justify-center gap-1`}
                data-testid={`payment-method-${method.id}`}
              >
                <span>{method.icon}</span>
                <span>{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        {selectedMethod && (
          <div className="mb-4 bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jumlah {selectedMethod.name}:
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                data-testid="payment-amount-input"
                className="flex-1 px-3 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xl font-bold text-center"
                placeholder="0"
                autoFocus
              />
              <button
                onClick={handleAddPayment}
                data-testid="add-payment-button"
                disabled={!inputAmount || parseFloat(inputAmount) <= 0}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 rounded-lg disabled:opacity-50"
              >
                Tambah
              </button>
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleQuickAmount(amount)}
                  className="bg-teal-100 hover:bg-teal-200 text-teal-800 font-semibold py-2 text-xs rounded-lg"
                >
                  {amount >= 1000000 ? `${amount / 1000000}jt` : `${amount / 1000}rb`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Payment List */}
        {payments.length > 0 && (
          <div className="mb-4 bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">Pembayaran:</h3>
            <div className="space-y-2">
              {payments.map((payment, index) => (
                <div key={index} className="flex justify-between items-center bg-white rounded p-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{payment.method_name}</span>
                    <span className="text-orange-600 font-bold text-sm">
                      Rp {payment.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemovePayment(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Total Dibayar:</span>
                <span className="font-bold">Rp {totalPaid.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Sisa:</span>
                <span className={`font-bold ${remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  Rp {Math.abs(remaining).toLocaleString('id-ID')}
                </span>
              </div>
              {change > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-700 font-semibold">Kembalian:</span>
                  <span className="text-green-600 font-bold text-lg">
                    Rp {change.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
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
            disabled={totalPaid < total}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {totalPaid >= total ? '✅ Konfirmasi & Print' : `⚠️ Kurang Rp ${remaining.toLocaleString('id-ID')}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
