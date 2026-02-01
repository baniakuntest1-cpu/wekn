import React from 'react';

const ProductGrid = ({ products, onAddToCart, searchTerm, selectedCategory }) => {
  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !selectedCategory || selectedCategory === 'all' || product.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {filteredProducts.map((product) => (
        <button
          key={product.id}
          data-testid={`product-${product.id}`}
          onClick={() => onAddToCart(product)}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-4 text-left border-2 border-transparent hover:border-orange-400 active:scale-95"
          disabled={product.stock <= 0}
        >
          <div className="aspect-square bg-gradient-to-br from-orange-100 to-teal-100 rounded-lg mb-3 flex items-center justify-center text-4xl">
            🍞
          </div>
          <h3 className="font-bold text-gray-800 mb-1 truncate" data-testid={`product-name-${product.id}`}>{product.name}</h3>
          <p className="text-orange-600 font-bold text-lg" data-testid={`product-price-${product.id}`}>Rp {product.price.toLocaleString('id-ID')}</p>
          <p className="text-sm text-gray-500 mt-1" data-testid={`product-stock-${product.id}`}>
            Stok: {product.stock > 0 ? product.stock : 'Habis'}
          </p>
        </button>
      ))}
      {filteredProducts.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-400">
          Tidak ada produk ditemukan
        </div>
      )}
    </div>
  );
};

export default ProductGrid;