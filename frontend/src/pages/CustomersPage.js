import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerModal from '../components/CustomerModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    // Filter customers based on search term
    if (searchTerm) {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API}/customers`);
      setCustomers(response.data);
      setFilteredCustomers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (customer = null) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        await axios.put(`${API}/customers/${editingCustomer.id}`, customerData);
      } else {
        await axios.post(`${API}/customers`, customerData);
      }
      
      fetchCustomers();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving customer:', error);
      if (error.response?.status === 400) {
        alert('Nomor HP sudah terdaftar!');
      } else {
        alert('Gagal menyimpan data pelanggan');
      }
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Yakin ingin menghapus pelanggan ini?')) {
      try {
        await axios.delete(`${API}/customers/${customerId}`);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Gagal menghapus pelanggan');
      }
    }
  };

  const formatPhone = (phone) => {
    // Format: 0812-3456-7890
    if (phone.length >= 11) {
      return `${phone.slice(0, 4)}-${phone.slice(4, 8)}-${phone.slice(8)}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div data-testid="customers-page">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800" data-testid="customers-title">
              👥 Manajemen Pelanggan
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Total: <span className="font-semibold">{customers.length} pelanggan</span>
            </p>
          </div>
          
          <button
            onClick={() => handleOpenModal()}
            data-testid="add-customer-button"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-3 rounded-lg transition-all shadow"
          >
            ➕ Tambah Pelanggan
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Cari nama atau nomor HP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="customer-search-input"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
        />
      </div>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-xl text-gray-600 mb-4">
            {searchTerm ? 'Tidak ada pelanggan ditemukan' : 'Belum ada pelanggan'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-6 py-3 rounded-lg"
            >
              Tambah Pelanggan Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-4 border-l-4 border-green-500" data-testid={`customer-card-${customer.id}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg" data-testid={`customer-name-${customer.id}`}>
                      {customer.name}
                    </h3>
                    <p className="text-sm text-gray-600">📱 {formatPhone(customer.phone)}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Transaksi</p>
                    <p className="font-bold text-blue-600">{customer.total_transactions || 0}x</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Belanja</p>
                    <p className="font-bold text-green-600">
                      Rp {(customer.total_spent || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(customer)}
                  data-testid={`edit-customer-${customer.id}`}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer.id)}
                  data-testid={`delete-customer-${customer.id}`}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all text-sm"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Modal */}
      <CustomerModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveCustomer}
        customer={editingCustomer}
      />
    </div>
  );
};

export default CustomersPage;
