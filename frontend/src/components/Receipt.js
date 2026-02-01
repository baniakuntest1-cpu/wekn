import React, { useEffect } from 'react';

const Receipt = ({ transaction, onClose, autoPrint = true }) => {
  useEffect(() => {
    if (autoPrint && transaction) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPrint, transaction]);

  if (!transaction) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 no-print" data-testid="receipt-modal">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-2">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Pembayaran Berhasil!</h2>
            <p className="text-gray-600">Struk sedang di-print...</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
            <div className="text-center mb-4">
              <img src="/logo-weekn.png" alt="WEEKN" className="h-16 mx-auto mb-2" />
              <p className="font-bold">WEEKN - Everyday is Weekend</p>
              <p className="text-xs text-gray-600">Toko Roti</p>
            </div>
            <div className="border-t border-gray-300 pt-3 mb-3">
              <p className="text-xs text-gray-600">No: {transaction.id.substring(0, 8)}</p>
              <p className="text-xs text-gray-600">{formatDate(transaction.timestamp)}</p>
              <p className="text-xs text-gray-600">Kasir: {transaction.cashier_name}</p>
            </div>
            {transaction.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs mb-1">
                <span>{item.product_name} x{item.quantity}</span>
                <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
              </div>
            ))}
            <div className="border-t border-gray-300 mt-2 pt-2">
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>Rp {transaction.total.toLocaleString('id-ID')}</span>
              </div>
              {/* Payment Methods */}
              {transaction.payment_methods && transaction.payment_methods.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Pembayaran:</p>
                  {transaction.payment_methods.map((pm, idx) => (
                    <div key={idx} className="mb-1">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize">{pm.method}</span>
                        <span>Rp {pm.amount.toLocaleString('id-ID')}</span>
                      </div>
                      {pm.reference && (
                        <div className="text-xs text-gray-500 ml-2">
                          Ref: {pm.reference}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {transaction.change > 0 && (
                <div className="flex justify-between text-xs font-semibold mt-1">
                  <span>Kembali</span>
                  <span>Rp {transaction.change.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>
            <div className="text-center mt-4 text-xs text-gray-600">
              <p>Terima kasih atas kunjungan Anda!</p>
              <p>❤️ Selamat menikmati!</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => window.print()}
              data-testid="print-again-button"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all"
            >
              🖨️ Print Ulang
            </button>
            <button
              onClick={onClose}
              data-testid="close-receipt-button"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>

      <div id="print-receipt" className="print-receipt">
        <div className="receipt-content">
          <div className="receipt-header">
            <div className="receipt-title">WEEKN</div>
            <div className="receipt-subtitle">Everyday is Weekend</div>
            <div className="receipt-subtitle">Toko Roti</div>
          </div>
          
          <div className="receipt-divider">
            <div>No: {transaction.id.substring(0, 8)}</div>
            <div>{formatDate(transaction.timestamp)}</div>
            <div>Kasir: {transaction.cashier_name}</div>
          </div>

          <div className="receipt-items">
            {transaction.items.map((item, idx) => (
              <div key={idx} className="receipt-item">
                <div className="item-name">{item.product_name}</div>
                <div className="item-detail">
                  <span>{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</span>
                  <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="receipt-total">
            <div className="total-row">
              <span>TOTAL</span>
              <span>Rp {transaction.total.toLocaleString('id-ID')}</span>
            </div>
            {transaction.payment_methods && transaction.payment_methods.length > 0 && (
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #000' }}>
                <div style={{ fontSize: '10px', marginBottom: '4px' }}>Pembayaran:</div>
                {transaction.payment_methods.map((pm, idx) => (
                  <div key={idx} className="payment-row">
                    <span style={{ textTransform: 'capitalize' }}>{pm.method}</span>
                    <span>Rp {pm.amount.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            )}
            {transaction.change > 0 && (
              <div className="payment-row bold" style={{ marginTop: '4px' }}>
                <span>Kembali</span>
                <span>Rp {transaction.change.toLocaleString('id-ID')}</span>
              </div>
            )}
          </div>

          <div className="receipt-footer">
            <div>Terima kasih atas</div>
            <div>kunjungan Anda!</div>
            <div>Selamat menikmati!</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Receipt;
