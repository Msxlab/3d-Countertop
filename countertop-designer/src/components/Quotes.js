// src/components/Quotes.js
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { saveQuote, fetchQuotes, deleteQuote, updateQuote } from "../services/firebase";

export const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [newQuote, setNewQuote] = useState({ name: "", email: "", price: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [currentQuoteId, setCurrentQuoteId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const currentState = useSelector(state => ({
        countertops: state.counterTop.countertops,
        customerInfo: state.counterTop.customerInfo
    }));

    useEffect(() => {
        loadQuotes();
    }, []);

    const loadQuotes = async () => {
        setIsLoading(true);
        try {
            const fetchedQuotes = await fetchQuotes();
            setQuotes(fetchedQuotes);
        } catch (error) {
            console.error('Teklifler yüklenirken hata:', error);
            alert('Teklifler yüklenirken bir hata oluştu.');
        }
        setIsLoading(false);
    };

    const calculateTotal = (quote) => {
        const basePrice = parseFloat(quote.price);
        const tax = basePrice * 0.18; // %18 KDV
        return {
            subtotal: basePrice,
            tax,
            total: basePrice + tax
        };
    };

    const handleAddQuote = async () => {
        if (!validateQuote()) return;

        setIsLoading(true);
        try {
            const quote = {
                ...newQuote,
                ...currentState,
                createdAt: new Date().toISOString(),
                status: 'pending'
            };
            await saveQuote(quote);
            await loadQuotes();
            resetForm();
            alert('Teklif başarıyla kaydedildi.');
        } catch (error) {
            console.error('Teklif kaydedilirken hata:', error);
            alert('Teklif kaydedilirken bir hata oluştu.');
        }
        setIsLoading(false);
    };

    const handleDeleteQuote = async (id) => {
        if (!window.confirm('Bu teklifi silmek istediğinizden emin misiniz?')) return;

        setIsLoading(true);
        try {
            await deleteQuote(id);
            await loadQuotes();
            alert('Teklif başarıyla silindi.');
        } catch (error) {
            console.error('Teklif silinirken hata:', error);
            alert('Teklif silinirken bir hata oluştu.');
        }
        setIsLoading(false);
    };

    const handleEditQuote = (quote) => {
        setNewQuote(quote);
        setIsEditing(true);
        setCurrentQuoteId(quote.id);
    };

    const handleUpdateQuote = async () => {
        if (!validateQuote()) return;

        setIsLoading(true);
        try {
            await updateQuote(currentQuoteId, {
                ...newQuote,
                updatedAt: new Date().toISOString()
            });
            await loadQuotes();
            resetForm();
            alert('Teklif başarıyla güncellendi.');
        } catch (error) {
            console.error('Teklif güncellenirken hata:', error);
            alert('Teklif güncellenirken bir hata oluştu.');
        }
        setIsLoading(false);
    };

    const validateQuote = () => {
        if (!newQuote.name.trim()) {
            alert('Lütfen müşteri adı girin.');
            return false;
        }
        if (!newQuote.email.trim() || !newQuote.email.includes('@')) {
            alert('Lütfen geçerli bir e-posta adresi girin.');
            return false;
        }
        if (newQuote.price <= 0) {
            alert('Lütfen geçerli bir fiyat girin.');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setNewQuote({ name: "", email: "", price: 0 });
        setIsEditing(false);
        setCurrentQuoteId(null);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Teklifler</h2>

            {/* Teklif Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Müşteri Adı"
                        value={newQuote.name}
                        onChange={(e) => setNewQuote({ ...newQuote, name: e.target.value })}
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500 
                                 focus:outline-none"
                    />
                    <input
                        type="email"
                        placeholder="E-posta"
                        value={newQuote.email}
                        onChange={(e) => setNewQuote({ ...newQuote, email: e.target.value })}
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500 
                                 focus:outline-none"
                    />
                    <input
                        type="number"
                        placeholder="Fiyat"
                        value={newQuote.price}
                        onChange={(e) => setNewQuote({ ...newQuote, price: e.target.value })}
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500 
                                 focus:outline-none"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={resetForm}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleUpdateQuote}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-500 text-white rounded 
                                         hover:bg-blue-600 disabled:bg-gray-400"
                            >
                                {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleAddQuote}
                            disabled={isLoading}
                            className="px-4 py-2 bg-green-500 text-white rounded 
                                     hover:bg-green-600 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Kaydediliyor...' : 'Teklif Ekle'}
                        </button>
                    )}
                </div>
            </div>

            {/* Teklif Listesi */}
            {isLoading && quotes.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
            ) : (
                <div className="space-y-4">
                    {quotes.map((quote) => {
                        const { subtotal, tax, total } = calculateTotal(quote);
                        return (
                            <div
                                key={quote.id}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium">{quote.name}</h3>
                                        <p className="text-sm text-gray-500">{quote.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditQuote(quote)}
                                            className="p-2 text-blue-500 hover:text-blue-600"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuote(quote.id)}
                                            className="p-2 text-red-500 hover:text-red-600"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>Ara Toplam: ${subtotal.toFixed(2)}</p>
                                    <p>KDV (%18): ${tax.toFixed(2)}</p>
                                    <p className="font-medium">Toplam: ${total.toFixed(2)}</p>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    {new Date(quote.createdAt).toLocaleDateString('tr-TR')}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};