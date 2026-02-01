import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NON_CASH_METHODS = [
  { id: 'qris', name: 'QRIS' },
  { id: 'gopay', name: 'GoPay' },
  { id: 'ovo', name: 'OVO' },
  { id: 'dana', name: 'Dana' },
  { id: 'shopeepay', name: 'ShopeePay' }
];

const PaymentModal = ({ isOpen, onClose, total, onConfirmPayment }) => {
  const [cashierName, setCashierName] = useState('Kasir');
  const [payments, setPayments] = useState([]);
  const [paymentType, setPaymentType] = useState(null); // 'cash' or 'noncash'
  const [nonCashMethod, setNonCashMethod] = useState('qris');
  const [inputAmount, setInputAmount] = useState('');
  const [reference, setReference] = useState('');
  
  // Customer states
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = total - totalPaid;
  const change = totalPaid > total ? totalPaid - total : 0;

  const handleSelectPaymentType = (type) => {
    setPaymentType(type);
    // Auto-fill remaining amount
    if (remaining > 0) {
      setInputAmount(remaining.toString());
    } else {
      setInputAmount(total.toString());
    }
    setReference('');
  };

  const handleUangPas = () => {
    if (remaining > 0) {
      setInputAmount(remaining.toString());
    } else {
      setInputAmount(total.toString());
    }
  };

  const handleAddPayment = () => {
    if (!paymentType || !inputAmount || parseFloat(inputAmount) <= 0) return;
    
    const amount = parseFloat(inputAmount);
    if (totalPaid + amount > total + 100000) return; // Prevent excessive overpayment
    
    const payment = {
      method: paymentType === 'cash' ? 'cash' : nonCashMethod,
      method_name: paymentType === 'cash' ? 'Tunai' : NON_CASH_METHODS.find(m => m.id === nonCashMethod)?.name,
      amount: amount,
      reference: paymentType === 'noncash' && reference ? reference : null
    };
    
    setPayments([...payments, payment]);
    setInputAmount('');
    setReference('');
    setPaymentType(null);
  };

  const handleRemovePayment = (index) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (totalPaid < total) {
      alert('Total pembayaran kurang dari total belanja!');
      return;
    }

    const paymentMethods = payments.map(p => ({
      method: p.method,
      amount: p.amount,
      reference: p.reference
    }));

    // For backward compatibility with cash
    const cashPayment = payments.find(p => p.method === 'cash');
    
    onConfirmPayment({
      payment_methods: paymentMethods,
      cash_received: cashPayment ? cashPayment.amount : null,
      change: change,
      cashier_name: cashierName,
      customer_id: selectedCustomer?.id || null,
      customer_name: selectedCustomer?.name || null
    });
    
    // Reset
    setPayments([]);
    setInputAmount('');
    setReference('');
    setPaymentType(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="payment-modal">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
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

        {/* Customer Selection */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            👤 Customer (Opsional):
          </label>
          {selectedCustomer ? (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-blue-900">{selectedCustomer.name}</p>
                <p className="text-sm text-blue-700">{selectedCustomer.phone}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-red-500 hover:text-red-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowCustomerModal(true)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-3 rounded-lg text-sm"
              >
                📋 Pilih Customer
              </button>
              <button
                onClick={() => {
                  setShowCustomerModal(true);
                  setCustomerSearchTerm('');
                }}
                className="bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-2 px-3 rounded-lg text-sm"
              >
                ➕ Daftar Baru
              </button>
            </div>
          )}
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

        {/* Payment Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pilih Metode Pembayaran:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSelectPaymentType('cash')}
              className={`${paymentType === 'cash' ? 'bg-green-500 text-white ring-2 ring-green-600' : 'bg-green-100 text-green-800 hover:bg-green-200'} font-bold py-4 text-lg rounded-lg transition-all flex items-center justify-center gap-2`}
              data-testid="payment-type-cash"
            >
              <span>💵</span>
              <span>TUNAI</span>
            </button>
            <button
              onClick={() => handleSelectPaymentType('noncash')}
              className={`${paymentType === 'noncash' ? 'bg-blue-500 text-white ring-2 ring-blue-600' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'} font-bold py-4 text-lg rounded-lg transition-all flex items-center justify-center gap-2`}
              data-testid="payment-type-noncash"
            >
              <span>📱</span>
              <span>NON-TUNAI</span>
            </button>
          </div>
        </div>

        {/* Payment Details */}
        {paymentType && (
          <div className="mb-4 bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
            {/* Non-Cash Method Selection */}
            {paymentType === 'noncash' && (
              <div className="mb-3">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Jenis Pembayaran:
                </label>
                <select
                  value={nonCashMethod}
                  onChange={(e) => setNonCashMethod(e.target.value)}
                  data-testid="noncash-method-select"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
                >
                  {NON_CASH_METHODS.map(method => (
                    <option key={method.id} value={method.id}>{method.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Amount Input */}
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Jumlah:
              </label>
              <div className="flex gap-2">
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
                  onClick={handleUangPas}
                  data-testid="exact-amount-button"
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-4 rounded-lg text-sm"
                >
                  🎯 Uang Pas
                </button>
              </div>
            </div>

            {/* Reference for Non-Cash */}
            {paymentType === 'noncash' && (
              <div className="mb-3">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  📝 No. Referensi (opsional):
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  data-testid="payment-reference-input"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
                  placeholder="Contoh: QRIS-2024020112345"
                />
                <p className="text-xs text-gray-500 mt-1">Masukkan nomor transaksi/referensi dari aplikasi</p>
              </div>
            )}

            {/* Add Button */}
            <button
              onClick={handleAddPayment}
              data-testid="add-payment-button"
              disabled={!inputAmount || parseFloat(inputAmount) <= 0}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ➕ Tambah Pembayaran
            </button>
          </div>
        )}

        {/* Payment List */}
        {payments.length > 0 && (
          <div className="mb-4 bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">Pembayaran:</h3>
            <div className="space-y-2">
              {payments.map((payment, index) => (
                <div key={index} className="bg-white rounded p-3 border border-blue-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">{payment.method_name}</span>
                        <button
                          onClick={() => handleRemovePayment(index)}
                          className="text-red-500 hover:text-red-700 font-bold text-xl leading-none"
                        >
                          ×
                        </button>
                      </div>
                      <div className="text-orange-600 font-bold">
                        Rp {payment.amount.toLocaleString('id-ID')}
                      </div>
                      {payment.reference && (
                        <div className="text-xs text-gray-600 mt-1">
                          Ref: {payment.reference}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-blue-300">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 font-semibold">Total Dibayar:</span>
                <span className="font-bold">Rp {totalPaid.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 font-semibold">Sisa:</span>
                <span className={`font-bold ${remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  Rp {Math.abs(remaining).toLocaleString('id-ID')}
                </span>
              </div>
              {change > 0 && (
                <div className="flex justify-between mt-2 pt-2 border-t border-blue-200">
                  <span className="text-green-700 font-bold">Kembalian:</span>
                  <span className="text-green-600 font-bold text-xl">
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
