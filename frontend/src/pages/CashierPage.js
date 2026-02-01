import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';
import Cart from '../components/Cart';
import PaymentModal from '../components/PaymentModal';
import Receipt from '../components/Receipt';

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

  const handleConfirmPayment = async (paymentData) => {
    try {
      const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
      
      const transactionData = {
        items: cartItems,
        total: total,
        ...paymentData
      };

      const response = await axios.post(`${API}/transactions`, transactionData);
      
      setCompletedTransaction(response.data);
      setShowPaymentModal(false);
      setCartItems([]);
      
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 p-6" data-testid="cashier-page">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Left: Product Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="🔍 Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="search-input"
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                data-testid="category-select"
                className="px-6 py-4 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-lg bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? '🎂 Semua Kategori' : `🍞 ${cat}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
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
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Cart
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={cartItems.reduce((sum, item) => sum + item.subtotal, 0)}
        onConfirmPayment={handleConfirmPayment}
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