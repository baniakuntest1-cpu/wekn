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

  const printStyles = {
    container: {
      width: '58mm',
      fontSize: '12px',
      fontFamily: 'monospace',
      padding: '5mm'
    },
    center: {
      textAlign: 'center',
      marginBottom: '10px'
    },
    title: {
      fontSize: '16px',
      fontWeight: 'bold'
    },
    small: {
      fontSize: '10px'
    },
    divider: {
      borderTop: '1px dashed #000',
      paddingTop: '8px',
      marginBottom: '8px',
      fontSize: '10px'
    },
    itemRow: {
      marginBottom: '4px'
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 'bold',
      fontSize: '14px',
      marginBottom: '4px'
    }
  };

  return (
    <>
      {/* Screen View */}
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
              <div className="flex justify-between text-xs">
                <span>Tunai</span>
                <span>Rp {transaction.cash_received.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span>Kembali</span>
                <span>Rp {transaction.change.toLocaleString('id-ID')}</span>
              </div>
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

      {/* Print View - 58mm thermal printer */}
      <div className="print-receipt">
        <div style={printStyles.container}>
          <div style={printStyles.center}>
            <div style={printStyles.title}>WEEKN</div>
            <div style={printStyles.small}>Everyday is Weekend</div>
            <div style={printStyles.small}>Toko Roti</div>
          </div>
          
          <div style={printStyles.divider}>
            <div>No: {transaction.id.substring(0, 8)}</div>
            <div>{formatDate(transaction.timestamp)}</div>
            <div>Kasir: {transaction.cashier_name}</div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            {transaction.items.map((item, idx) => (
              <div key={idx} style={printStyles.itemRow}>
                <div style={printStyles.flexBetween}>
                  <span>{item.product_name}</span>
                </div>
                <div style={{ ...printStyles.flexBetween, fontSize: '10px' }}>
                  <span>{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</span>
                  <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={printStyles.divider}>
            <div style={printStyles.totalRow}>
              <span>TOTAL</span>
              <span>Rp {transaction.total.toLocaleString('id-ID')}</span>
            </div>
            <div style={{ ...printStyles.flexBetween, fontSize: '10px' }}>
              <span>Tunai</span>
              <span>Rp {transaction.cash_received.toLocaleString('id-ID')}</span>
            </div>
            <div style={{ ...printStyles.flexBetween, fontSize: '10px', fontWeight: 'bold' }}>
              <span>Kembali</span>
              <span>Rp {transaction.change.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div style={{ ...printStyles.center, fontSize: '10px', marginTop: '10px' }}>
            <div>Terima kasih atas</div>
            <div>kunjungan Anda!</div>
            <div style={{ marginTop: '5px' }}>Selamat menikmati!</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Receipt;
