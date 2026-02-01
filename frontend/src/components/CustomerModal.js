import React, { useState, useEffect } from 'react';

const CustomerModal = ({ isOpen, onClose, onSave, customer }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone
      });
    } else {
      setFormData({ name: '', phone: '' });
    }
    setErrors({});
  }, [customer, isOpen]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor HP harus diisi';
    } else if (!/^[0-9]{10,13}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Nomor HP tidak valid (10-13 digit)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Clean phone number
      const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
      onSave({
        ...formData,
        phone: cleanPhone
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="customer-modal">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {customer ? '✏️ Edit Pelanggan' : '➕ Tambah Pelanggan'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Lengkap: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              data-testid="customer-name-input"
              className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-orange-500 focus:outline-none`}
              placeholder="Contoh: Budi Santoso"
              autoFocus
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nomor HP: <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              data-testid="customer-phone-input"
              className={`w-full px-4 py-3 border-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-orange-500 focus:outline-none`}
              placeholder="08123456789"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Format: 08XXXXXXXXX (10-13 digit)</p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-800">
              💡 <strong>Tips:</strong> Nomor HP akan digunakan untuk identifikasi pelanggan. Pastikan nomor yang dimasukkan benar dan aktif.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              data-testid="customer-cancel-button"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              data-testid="customer-save-button"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all"
            >
              💾 Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
