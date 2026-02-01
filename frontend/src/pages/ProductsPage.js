import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    barcode: '',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        barcode: product.barcode || '',
        description: product.description || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: '',
        stock: '',
        barcode: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, data);
      } else {
        await axios.post(`${API}/products`, data);
      }

      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Gagal menyimpan produk');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await axios.delete(`${API}/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Gagal menghapus produk');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 p-3" data-testid="products-page">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-3 mb-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800" data-testid="products-title">
              🍞 Manajemen Produk
            </h1>
            <button
              onClick={() => handleOpenModal()}
              data-testid="add-product-button"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-4 py-2 text-sm rounded-lg transition-all shadow"
            >
              + Tambah Produk
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden" data-testid={`product-card-${product.id}`}>
              <div className="bg-gradient-to-br from-orange-100 to-teal-100 h-32 flex items-center justify-center text-4xl">
                🍞
              </div>
              <div className="p-3">
                <h3 className="font-bold text-base text-gray-800 mb-1" data-testid={`product-card-name-${product.id}`}>{product.name}</h3>
                <p className="text-orange-600 font-bold text-lg mb-1">Rp {product.price.toLocaleString('id-ID')}</p>
                <div className="space-y-0.5 text-xs text-gray-600 mb-2">
                  <p>🏷️ {product.category}</p>
                  <p className={product.stock <= 10 ? 'text-red-600 font-semibold' : ''}>
                    📦 Stok: {product.stock}
                  </p>
                  {product.barcode && <p>🔖 {product.barcode}</p>}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleOpenModal(product)}
                    data-testid={`edit-product-${product.id}`}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 text-xs rounded transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    data-testid={`delete-product-${product.id}`}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 text-xs rounded transition-all"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🍞</div>
            <p className="text-xl text-gray-600 mb-4">Belum ada produk</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-6 py-3 rounded-lg"
            >
              Tambah Produk Pertama
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="product-modal">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Produk *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    data-testid="product-name-input"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Harga (Rp) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      data-testid="product-price-input"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Stok *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      data-testid="product-stock-input"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    data-testid="product-category-input"
                    placeholder="Contoh: Roti Manis, Kue Kering, dll"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Barcode (opsional)</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                    data-testid="product-barcode-input"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi (opsional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    data-testid="product-description-input"
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  data-testid="cancel-button"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  data-testid="save-product-button"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;