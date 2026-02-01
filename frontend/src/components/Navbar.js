import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-gradient-to-r from-orange-400 to-teal-400 shadow-lg" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img src="/logo-weekn.png" alt="WEEKN Logo" className="h-12 w-auto" />
            <span className="text-white font-bold text-xl">WEEKN POS</span>
          </div>
          
          <div className="flex space-x-2">
            <Link
              to="/"
              data-testid="nav-cashier"
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                isActive('/') 
                  ? 'bg-white text-orange-500 shadow-md' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              💰 Kasir
            </Link>
            <Link
              to="/products"
              data-testid="nav-products"
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                isActive('/products') 
                  ? 'bg-white text-orange-500 shadow-md' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              🍞 Produk
            </Link>
            <Link
              to="/reports"
              data-testid="nav-reports"
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                isActive('/reports') 
                  ? 'bg-white text-orange-500 shadow-md' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              📊 Laporan
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;