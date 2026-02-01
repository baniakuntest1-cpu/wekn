import React from 'react';

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2" data-testid="cart-title">
        🛒 Keranjang
        {cartItems.length > 0 && (
          <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full">
            {cartItems.length}
          </span>
        )}
      </h2>
      
      <div className="flex-1 overflow-y-auto space-y-3 mb-4" data-testid="cart-items">
        {cartItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-6xl mb-4">🛒</div>
            <p>Keranjang kosong</p>
            <p className="text-sm">Pilih produk untuk mulai</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.product_id} className="bg-gray-50 rounded-lg p-4" data-testid={`cart-item-${item.product_id}`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800 flex-1" data-testid={`cart-item-name-${item.product_id}`}>{item.product_name}</h4>
                <button
                  onClick={() => onRemoveItem(item.product_id)}
                  data-testid={`cart-remove-${item.product_id}`}
                  className="text-red-500 hover:text-red-700 ml-2 text-xl"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300">
                  <button
                    onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                    data-testid={`cart-decrease-${item.product_id}`}
                    className="px-4 py-2 text-xl font-bold text-gray-600 hover:bg-gray-100 rounded-l-lg"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-bold min-w-[3rem] text-center" data-testid={`cart-quantity-${item.product_id}`}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                    data-testid={`cart-increase-${item.product_id}`}
                    className="px-4 py-2 text-xl font-bold text-gray-600 hover:bg-gray-100 rounded-r-lg"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">@ Rp {item.price.toLocaleString('id-ID')}</p>
                  <p className="font-bold text-orange-600" data-testid={`cart-subtotal-${item.product_id}`}>
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t-2 border-gray-200 pt-4 mt-auto">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-semibold text-gray-700">TOTAL:</span>
          <span className="text-4xl font-bold text-orange-600" data-testid="cart-total">
            Rp {total.toLocaleString('id-ID')}
          </span>
        </div>
        
        <button
          onClick={onCheckout}
          data-testid="checkout-button"
          disabled={cartItems.length === 0}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-2xl py-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          💰 BAYAR
        </button>
      </div>
    </div>
  );
};

export default Cart;