import React from 'react';

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout, onApplyItemDiscount, onApplyTransactionDiscount, transactionDiscount }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const itemsDiscountTotal = cartItems.reduce((sum, item) => sum + (item.discount_amount || 0), 0);
  const transactionDiscountAmount = transactionDiscount?.amount || 0;
  const total = subtotal - itemsDiscountTotal - transactionDiscountAmount;

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col p-3 relative">
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2" data-testid="cart-title">
        🛒 Keranjang
        {cartItems.length > 0 && (
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            {cartItems.length}
          </span>
        )}
      </h2>
      
      <div className="flex-1 overflow-y-auto space-y-2 pb-2" style={{ maxHeight: 'calc(100vh - 200px)' }} data-testid="cart-items">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🛒</div>
            <p className="text-sm">Keranjang kosong</p>
            <p className="text-xs">Pilih produk</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.product_id} className="bg-gray-50 rounded-lg p-2" data-testid={`cart-item-${item.product_id}`}>
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-gray-800 flex-1 text-sm" data-testid={`cart-item-name-${item.product_id}`}>{item.product_name}</h4>
                <button
                  onClick={() => onRemoveItem(item.product_id)}
                  data-testid={`cart-remove-${item.product_id}`}
                  className="text-red-500 hover:text-red-700 ml-2 text-lg"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1 bg-white rounded border border-gray-300">
                  <button
                    onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                    data-testid={`cart-decrease-${item.product_id}`}
                    className="px-2 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-2 py-1 font-bold text-sm min-w-[2rem] text-center" data-testid={`cart-quantity-${item.product_id}`}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                    data-testid={`cart-increase-${item.product_id}`}
                    className="px-2 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">@ Rp {item.price.toLocaleString('id-ID')}</p>
                  <p className="font-bold text-orange-600 text-sm" data-testid={`cart-subtotal-${item.product_id}`}>
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              
              {/* Item Discount */}
              {item.discount_amount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded p-1 mt-1">
                  <p className="text-xs text-green-700">
                    Diskon {item.discount_type === 'percentage' ? `${item.discount_value}%` : `Rp ${item.discount_value.toLocaleString('id-ID')}`}: 
                    <span className="font-bold ml-1">- Rp {item.discount_amount.toLocaleString('id-ID')}</span>
                  </p>
                </div>
              )}
              
              {/* Discount Button */}
              <button
                onClick={() => onApplyItemDiscount(item)}
                data-testid={`cart-discount-${item.product_id}`}
                className="w-full mt-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold py-1 text-xs rounded transition-all"
              >
                🏷️ {item.discount_amount > 0 ? 'Ubah Diskon' : 'Diskon'}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Sticky Total & Button BAYAR */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 pt-4 pb-3 px-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        
        {/* Items Discount */}
        {itemsDiscountTotal > 0 && (
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-green-600">Diskon Item:</span>
            <span className="font-semibold text-green-600">- Rp {itemsDiscountTotal.toLocaleString('id-ID')}</span>
          </div>
        )}
        
        {/* Transaction Discount */}
        {transactionDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-green-600">
              Diskon Transaksi {transactionDiscount.type === 'percentage' ? `(${transactionDiscount.value}%)` : ''}:
            </span>
            <span className="font-semibold text-green-600">- Rp {transactionDiscountAmount.toLocaleString('id-ID')}</span>
          </div>
        )}
        
        {/* Transaction Discount Button */}
        {cartItems.length > 0 && (
          <button
            onClick={onApplyTransactionDiscount}
            data-testid="transaction-discount-button"
            className="w-full mb-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-2 text-sm rounded transition-all"
          >
            🏷️ {transactionDiscountAmount > 0 ? 'Ubah' : 'Tambah'} Diskon Transaksi
          </button>
        )}
        
        {/* Total */}
        <div className="flex justify-between items-center mb-4 border-t-2 border-gray-300 pt-2">
          <span className="text-lg font-bold text-gray-700">TOTAL:</span>
          <span className="text-3xl font-bold text-orange-600" data-testid="cart-total">
            Rp {total.toLocaleString('id-ID')}
          </span>
        </div>
        
        <button
          onClick={onCheckout}
          data-testid="checkout-button"
          disabled={cartItems.length === 0}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xl py-5 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          💰 BAYAR
        </button>
      </div>
    </div>
  );
};

export default Cart;