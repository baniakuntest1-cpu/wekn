import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';
import Cart from '../components/Cart';
import PaymentModal from '../components/PaymentModal';
import Receipt from '../components/Receipt';
import DiscountModal from '../components/DiscountModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CashierPage = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Discount states
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountTarget, setDiscountTarget] = useState(null); // item or 'transaction'
  const [transactionDiscount, setTransactionDiscount] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const handleAddToCart = (product) => {
    if (product.stock <= 0) return;

    const existingItem = cartItems.find(item => item.product_id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCartItems(cartItems.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
            : item
        ));
      }
    } else {
      setCartItems([...cartItems, {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        price: product.price,
        subtotal: product.price
      }]);
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && newQuantity <= product.stock) {
      setCartItems(cartItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
          : item
      ));
    }
  };

  const handleRemoveItem = (productId) => {
    setCartItems(cartItems.filter(item => item.product_id !== productId));
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setShowPaymentModal(true);
    }
  };

  const handleApplyItemDiscount = (item) => {
    setDiscountTarget(item);
    setShowDiscountModal(true);
  };

  const handleApplyTransactionDiscount = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const itemsDiscount = cartItems.reduce((sum, item) => sum + (item.discount_amount || 0), 0);
    const currentSubtotal = subtotal - itemsDiscount;
    
    setDiscountTarget({ type: 'transaction', amount: currentSubtotal });
    setShowDiscountModal(true);
  };

  const handleDiscountApply = (discountData) => {
    if (discountTarget.type === 'transaction') {
      // Apply transaction discount
      setTransactionDiscount(discountData);
    } else {
      // Apply item discount
      setCartItems(cartItems.map(item => {
        if (item.product_id === discountTarget.product_id) {
          return {
            ...item,
            discount_type: discountData.type,
            discount_value: discountData.value,
            discount_amount: discountData.amount
          };
        }
        return item;
      }));
    }
    
    setShowDiscountModal(false);
    setDiscountTarget(null);
  };

  const handleConfirmPayment = async (paymentData) => {
    try {
      const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
      const itemsDiscountTotal = cartItems.reduce((sum, item) => sum + (item.discount_amount || 0), 0);
      const transactionDiscountAmount = transactionDiscount?.amount || 0;
      const total = subtotal - itemsDiscountTotal - transactionDiscountAmount;
      
      const transactionData = {
        items: cartItems,
        subtotal: subtotal,
        discount_amount: itemsDiscountTotal + transactionDiscountAmount,
        discount_type: transactionDiscount ? transactionDiscount.type : (itemsDiscountTotal > 0 ? 'item' : null),
        total: total,
        ...paymentData
      };

      const response = await axios.post(`${API}/transactions`, transactionData);
      
      setCompletedTransaction(response.data);
      setShowPaymentModal(false);
      setCartItems([]);
      setTransactionDiscount(null);
      
      // Refresh products to update stock
      fetchProducts();
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Gagal memproses pembayaran');
    }
  };

  const handleCloseReceipt = () => {
    setCompletedTransaction(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 to-teal-50 p-3 overflow-hidden" data-testid="cashier-page">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 max-w-7xl mx-auto h-full">
        {/* Left: Product Selection */}
        <div className="lg:col-span-2 flex flex-col overflow-hidden">
          <div className="bg-white rounded-lg shadow p-3 mb-3">
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="🔍 Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="search-input"
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                data-testid="category-select"
                className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-sm bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? '🍰 Semua' : `🍞 ${cat}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 flex-1 overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              🍞 Produk
            </h2>
            <ProductGrid
              products={products}
              onAddToCart={handleAddToCart}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>

        {/* Right: Cart */}
        <div className="lg:col-span-1 flex flex-col overflow-hidden">
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
            onApplyItemDiscount={handleApplyItemDiscount}
            onApplyTransactionDiscount={handleApplyTransactionDiscount}
            transactionDiscount={transactionDiscount}
          />
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={cartItems.reduce((sum, item) => sum + item.subtotal, 0) - cartItems.reduce((sum, item) => sum + (item.discount_amount || 0), 0) - (transactionDiscount?.amount || 0)}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Discount Modal */}
      <DiscountModal
        isOpen={showDiscountModal}
        onClose={() => {
          setShowDiscountModal(false);
          setDiscountTarget(null);
        }}
        onApply={handleDiscountApply}
        itemName={discountTarget?.type === 'transaction' ? 'Total Transaksi' : discountTarget?.product_name}
        originalPrice={discountTarget?.type === 'transaction' ? discountTarget.amount : discountTarget?.subtotal || 0}
      />

      {/* Receipt */}
      {completedTransaction && (
        <Receipt
          transaction={completedTransaction}
          onClose={handleCloseReceipt}
          autoPrint={true}
        />
      )}
    </div>
  );
};

export default CashierPage;