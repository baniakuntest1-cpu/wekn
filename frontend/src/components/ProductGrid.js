import React from 'react';

const ProductGrid = ({ products, onAddToCart, searchTerm, selectedCategory }) => {
  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !selectedCategory || selectedCategory === 'all' || product.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {filteredProducts.map((product) => (
        <button
          key={product.id}
          data-testid={`product-${product.id}`}
          onClick={() => onAddToCart(product)}
          className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-2 text-left border-2 border-transparent hover:border-orange-400 active:scale-95"
          disabled={product.stock <= 0}
        >
          <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-teal-100 rounded-lg mb-2 flex items-center justify-center text-3xl">
            🍞
          </div>
          <h3 className="font-bold text-gray-800 text-xs mb-1 truncate" data-testid={`product-name-${product.id}`}>{product.name}</h3>
          <p className="text-orange-600 font-bold text-sm" data-testid={`product-price-${product.id}`}>Rp {product.price.toLocaleString('id-ID')}</p>
          <p className="text-xs text-gray-500 mt-1" data-testid={`product-stock-${product.id}`}>
            Stok: {product.stock > 0 ? product.stock : 'Habis'}
          </p>
        </button>
      ))}
      {filteredProducts.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-400 text-sm">
          Tidak ada produk ditemukan
        </div>
      )}
    </div>
  );
};

export default ProductGrid;