import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PaymentModal = ({ isOpen, onClose, total, onConfirmPayment }) => {
  const [cashierName, setCashierName] = useState('Kasir');
  const [payments, setPayments] = useState([]);
  const [paymentType, setPaymentType] = useState(null); // 'cash', 'edc', 'qris', 'tf'
  const [inputAmount, setInputAmount] = useState('');
  const [reference, setReference] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
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
    
    const methodNames = {
      'cash': 'Tunai',
      'edc': 'EDC',
      'qris': 'QRIS',
      'tf': 'Transfer'
    };
    
    const payment = {
      method: paymentType,
      method_name: methodNames[paymentType],
      amount: amount,
      reference: (paymentType !== 'cash' && reference) ? reference : null
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

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const handleFinalConfirm = () => {
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
    setShowConfirmation(false);
  };

  const handleRegisterCustomer = async () => {
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
      alert('Nama dan nomor telepon harus diisi!');
      return;
    }

    try {
      const response = await axios.post(`${API}/customers`, {
        name: newCustomerName.trim(),
        phone: newCustomerPhone.trim()
      });
      
      setSelectedCustomer(response.data);
      setShowCustomerModal(false);
      setNewCustomerName('');
      setNewCustomerPhone('');
      setCustomerSearchTerm('');
      
      // Refresh customer list
      fetchCustomers();
    } catch (error) {
      console.error('Error registering customer:', error);
      alert('Gagal mendaftarkan customer');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.phone.includes(customerSearchTerm)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="payment-modal">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-3 pb-2">
          <h2 className="text-lg font-bold text-gray-800 text-center" data-testid="payment-modal-title">
            💳 Pembayaran
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {/* Total Belanja */}
          <div className="bg-orange-50 rounded-lg p-2 mb-3">
            <p className="text-xs text-gray-600">Total Belanja:</p>
            <p className="text-xl font-bold text-orange-600" data-testid="payment-total">
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
                data-testid="remove-customer-button"
                className="text-red-500 hover:text-red-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowCustomerModal(true)}
                data-testid="select-customer-button"
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-3 rounded-lg text-sm"
              >
                📋 Pilih Customer
              </button>
              <button
                onClick={() => {
                  setShowCustomerModal(true);
                  setCustomerSearchTerm('');
                }}
                data-testid="register-new-customer-button"
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
        <div className="mb-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Pilih Metode Pembayaran:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSelectPaymentType('cash')}
              className={`${paymentType === 'cash' ? 'bg-green-500 text-white ring-2 ring-green-600' : 'bg-green-100 text-green-800 hover:bg-green-200'} font-bold py-2 text-sm rounded-lg transition-all flex items-center justify-center gap-1`}
              data-testid="payment-type-cash"
            >
              <span>💵</span>
              <span>TUNAI</span>
            </button>
            <button
              onClick={() => handleSelectPaymentType('edc')}
              className={`${paymentType === 'edc' ? 'bg-blue-500 text-white ring-2 ring-blue-600' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'} font-bold py-2 text-sm rounded-lg transition-all flex items-center justify-center gap-1`}
              data-testid="payment-type-edc"
            >
              <span>💳</span>
              <span>EDC</span>
            </button>
            <button
              onClick={() => handleSelectPaymentType('qris')}
              className={`${paymentType === 'qris' ? 'bg-purple-500 text-white ring-2 ring-purple-600' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'} font-bold py-2 text-sm rounded-lg transition-all flex items-center justify-center gap-1`}
              data-testid="payment-type-qris"
            >
              <span>📱</span>
              <span>QRIS</span>
            </button>
            <button
              onClick={() => handleSelectPaymentType('tf')}
              className={`${paymentType === 'tf' ? 'bg-teal-500 text-white ring-2 ring-teal-600' : 'bg-teal-100 text-teal-800 hover:bg-teal-200'} font-bold py-2 text-sm rounded-lg transition-all flex items-center justify-center gap-1`}
              data-testid="payment-type-tf"
            >
              <span>🏦</span>
              <span>TF</span>
            </button>
          </div>
        </div>

        {/* Payment Details */}
        {paymentType && (
          <div className="mb-4 bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
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
            {paymentType !== 'cash' && (
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
                  placeholder="Contoh: TRX-2024020112345"
                />
                <p className="text-xs text-gray-500 mt-1">Masukkan nomor transaksi/referensi</p>
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
        </div>
        
        {/* Sticky Footer */}
        <div className="border-t bg-white p-4">
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

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Pembayaran</h3>
            </div>

            {/* Items List */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
              <p className="font-semibold text-sm text-gray-700 mb-2">Produk yang dibeli:</p>
              {/* Get cart items from parent - we'll need to pass this as prop */}
              <div className="space-y-1 text-sm text-gray-600">
                <p className="text-xs italic">Lihat detail di keranjang</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold">Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Diskon:</span>
                <span className="font-semibold">Rp 0</span>
              </div>
              <div className="border-t border-blue-200 my-2"></div>
              <div className="flex justify-between text-base mb-3">
                <span className="font-bold text-gray-800">TOTAL:</span>
                <span className="font-bold text-orange-600 text-xl">Rp {total.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="bg-white rounded p-2">
                <p className="text-sm font-semibold text-gray-700 mb-1">Metode Pembayaran:</p>
                {payments.map((payment, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{payment.method_name}</span>
                    <span className="font-semibold">Rp {payment.amount.toLocaleString('id-ID')}</span>
                  </div>
                ))}
                {change > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-semibold mt-1 pt-1 border-t">
                    <span>Kembalian:</span>
                    <span>Rp {change.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-center text-gray-700 font-semibold mb-4">
              Apakah Anda yakin?
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleFinalConfirm}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all"
              >
                Ya, Proses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">👤 Pilih/Daftar Customer</h3>
              <button
                onClick={() => {
                  setShowCustomerModal(false);
                  setNewCustomerName('');
                  setNewCustomerPhone('');
                  setCustomerSearchTerm('');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Register New Customer Form */}
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-green-800 mb-3">➕ Daftar Customer Baru</h4>
              <div className="mb-3">
                <input
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  data-testid="new-customer-name-input"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm"
                  placeholder="Nama customer"
                />
              </div>
              <div className="mb-3">
                <input
                  type="tel"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  data-testid="new-customer-phone-input"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm"
                  placeholder="Nomor telepon"
                />
              </div>
              <button
                onClick={handleRegisterCustomer}
                data-testid="register-and-select-button"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg"
              >
                ✅ Daftar & Pilih
              </button>
            </div>

            {/* Search & Select Existing Customer */}
            <div>
              <h4 className="font-bold text-gray-800 mb-2">📋 Atau Pilih dari Daftar</h4>
              <input
                type="text"
                value={customerSearchTerm}
                onChange={(e) => setCustomerSearchTerm(e.target.value)}
                data-testid="customer-search-input"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm mb-3"
                placeholder="🔍 Cari nama atau nomor telepon..."
              />
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredCustomers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Tidak ada customer</p>
                ) : (
                  filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowCustomerModal(false);
                        setCustomerSearchTerm('');
                      }}
                      data-testid={`customer-option-${customer.id}`}
                      className="w-full bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg p-3 text-left transition-all"
                    >
                      <p className="font-semibold text-blue-900">{customer.name}</p>
                      <p className="text-sm text-blue-700">{customer.phone}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {customer.total_transactions || 0}x transaksi • Rp {(customer.total_spent || 0).toLocaleString('id-ID')}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentModal;
