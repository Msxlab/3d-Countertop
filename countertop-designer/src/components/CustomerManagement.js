// src/components/CustomerManagement.js
import React, { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';

export const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        type: 'individual',
        notes: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState({ status: 'active', type: '' });

    useEffect(() => {
        loadCustomers();
    }, [filter]);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const data = await customerService.getCustomers(filter);
            setCustomers(data);
        } catch (error) {
            console.error('Müşteriler yüklenemedi:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (selectedCustomer) {
                await customerService.updateCustomer(selectedCustomer.id, formData);
            } else {
                await customerService.addCustomer(formData);
            }
            resetForm();
            loadCustomers();
        } catch (error) {
            console.error('Müşteri kaydedilemedi:', error);
        }
        setLoading(false);
    };

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setFormData(customer);
        setShowForm(true);
    };

    const handleDelete = async (customerId) => {
        if (!window.confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) {
            return;
        }
        setLoading(true);
        try {
            await customerService.deleteCustomer(customerId);
            loadCustomers();
        } catch (error) {
            console.error('Müşteri silinemedi:', error);
        }
        setLoading(false);
    };

    const resetForm = () => {
        setSelectedCustomer(null);
        setFormData({
            name: '',
            company: '',
            email: '',
            phone: '',
            address: '',
            type: 'individual',
            notes: ''
        });
        setShowForm(false);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4">
            {/* Üst Bar */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Müşteri Yönetimi</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Yeni Müşteri
                </button>
            </div>

            {/* Arama ve Filtreler */}
            <div className="mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Müşteri ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-2 border rounded"
                />
                <select
                    value={filter.status}
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    className="p-2 border rounded"
                >
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                    <option value="">Tümü</option>
                </select>
                <select
                    value={filter.type}
                    onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                    className="p-2 border rounded"
                >
                    <option value="">Tüm Tipler</option>
                    <option value="individual">Bireysel</option>
                    <option value="corporate">Kurumsal</option>
                </select>
            </div>

            {/* Müşteri Formu */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                        <h3 className="text-xl font-semibold mb-4">
                            {selectedCustomer ? 'Müşteri Düzenle' : 'Yeni Müşteri'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Ad Soyad
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            name: e.target.value
                                        })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Şirket
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            company: e.target.value
                                        })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        E-posta
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            email: e.target.value
                                        })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Telefon
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            phone: e.target.value
                                        })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Adres
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: e.target.value
                                    })}
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Notlar
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        notes: e.target.value
                                    })}
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded 
                                             hover:bg-blue-600"
                                    disabled={loading}
                                >
                                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Müşteri Listesi */}
            {loading && customers.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 
                                  border-blue-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCustomers.map(customer => (
                        <div
                            key={customer.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-medium">{customer.name}</h3>
                                    {customer.company && (
                                        <p className="text-sm text-gray-500">
                                            {customer.company}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(customer)}
                                        className="p-1 text-blue-500 hover:text-blue-600"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(customer.id)}
                                        className="p-1 text-red-500 hover:text-red-600"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>{customer.email}</p>
                                <p>{customer.phone}</p>
                                {customer.address && (
                                    <p className="truncate">{customer.address}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};