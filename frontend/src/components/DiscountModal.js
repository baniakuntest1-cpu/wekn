import React, { useState } from 'react';

const DiscountModal = ({ isOpen, onClose, onApply, itemName, originalPrice }) => {
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage' or 'nominal'
  const [discountValue, setDiscountValue] = useState('');

  const value = parseFloat(discountValue) || 0;
  
  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = (originalPrice * value) / 100;
  } else {
    discountAmount = value;
  }

  // Validation
  if (discountAmount > originalPrice) {
    discountAmount = originalPrice;
  }

  const finalPrice = originalPrice - discountAmount;

  const handleApply = () => {
    if (value <= 0) {
      alert('Masukkan nilai diskon yang valid!');
      return;
    }

    if (discountType === 'percentage' && value > 100) {
      alert('Diskon maksimal 100%!');
      return;
    }

    if (discountType === 'nominal' && value > originalPrice) {
      alert('Diskon tidak boleh lebih dari harga!');
      return;
    }

    onApply({
      type: discountType,
      value: value,
      amount: discountAmount
    });

    // Reset
    setDiscountValue('');
    setDiscountType('percentage');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="discount-modal">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          🏷️ Diskon
        </h2>

        {itemName && (
          <div className="bg-gray-100 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600">Untuk:</p>
            <p className="font-bold text-gray-800">{itemName}</p>
          </div>
        )}

        <div className="bg-orange-50 rounded-lg p-4 mb-4">
          <p className="text-xs text-gray-600 mb-1">Harga Awal:</p>
          <p className="text-2xl font-bold text-orange-600">
            Rp {originalPrice.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Discount Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Jenis Diskon:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDiscountType('percentage')}
              className={`${
                discountType === 'percentage'
                  ? 'bg-blue-500 text-white ring-2 ring-blue-600'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              } font-bold py-3 rounded-lg transition-all`}
              data-testid="discount-type-percentage"
            >
              % Persen
            </button>
            <button
              onClick={() => setDiscountType('nominal')}
              className={`${
                discountType === 'nominal'
                  ? 'bg-green-500 text-white ring-2 ring-green-600'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              } font-bold py-3 rounded-lg transition-all`}
              data-testid="discount-type-nominal"
            >
              Rp Nominal
            </button>
          </div>
        </div>

        {/* Discount Value Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {discountType === 'percentage' ? 'Persentase Diskon:' : 'Nominal Diskon (Rp):'}
          </label>
          <input
            type="number"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            data-testid="discount-value-input"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xl font-bold text-center"
            placeholder={discountType === 'percentage' ? '0' : '0'}
            autoFocus
            max={discountType === 'percentage' ? 100 : originalPrice}
          />
          {discountType === 'percentage' && (
            <p className="text-xs text-gray-500 mt-1">Maksimal 100%</p>
          )}
        </div>

        {/* Quick Discount Buttons */}
        {discountType === 'percentage' && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Diskon Cepat:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 50].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setDiscountValue(percent.toString())}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold py-2 rounded-lg text-sm"
                >
                  {percent}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preview */}
        {value > 0 && (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Diskon:</span>
              <span className="font-bold text-red-600">
                - Rp {discountAmount.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-green-200">
              <span className="text-green-700 font-bold">Harga Setelah Diskon:</span>
              <span className="text-green-600 font-bold text-xl">
                Rp {finalPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            data-testid="discount-cancel-button"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            data-testid="discount-apply-button"
            disabled={value <= 0}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Terapkan Diskon
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;
