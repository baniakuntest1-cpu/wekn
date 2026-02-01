import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const MENU_ITEMS = [
  {
    section: 'TRANSAKSI',
    items: [
      { path: '/kasir', icon: '💰', label: 'Kasir', fullscreen: true },
      { path: '/shifts', icon: '💼', label: 'Shift Kasir' },
      { path: '/riwayat', icon: '📝', label: 'Riwayat' }
    ]
  },
  {
    section: 'INVENTORY',
    items: [
      { path: '/products', icon: '📦', label: 'Produk' },
      { path: '/stok', icon: '📊', label: 'Stok' }
    ]
  },
  {
    section: 'CUSTOMER',
    items: [
      { path: '/pelanggan', icon: '👥', label: 'Pelanggan' },
      { path: '/loyalty', icon: '🎁', label: 'Program Loyalty' }
    ]
  },
  {
    section: 'LAPORAN',
    items: [
      { path: '/reports', icon: '📈', label: 'Penjualan' }
    ]
  },
  {
    section: 'SYSTEM',
    items: [
      { path: '/users', icon: '👤', label: 'Manajemen User' }
    ]
  }
];

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gray-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 flex flex-col z-50`}>
      {/* Logo & Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src="/logo-weekn.png" alt="WEEKN" className="h-10 w-auto" />
            <div>
              <div className="font-bold text-sm">WEEKN</div>
              <div className="text-xs text-gray-400">POS System</div>
            </div>
          </div>
        )}
        {isCollapsed && (
          <img src="/logo-weekn.png" alt="WEEKN" className="h-10 w-10 mx-auto" />
        )}
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white p-1"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        {MENU_ITEMS.map((section, idx) => (
          <div key={idx} className="mb-4">
            {!isCollapsed && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                {section.section}
              </div>
            )}
            {section.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 transition-all ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* User Profile & Logout */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{user.name || 'User'}</div>
              <div className="text-xs text-gray-400 truncate">
                {user.role === 'super_admin' ? '👑 Super Admin' : '💰 Kasir'}
              </div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm"
          >
            🚪 Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
