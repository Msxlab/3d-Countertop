// src/components/StoneSelection.js
import React, { useState } from "react";

export const StoneSelection = ({ onNext }) => {
    const [stoneType, setStoneType] = useState("");
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [errors, setErrors] = useState({});

    const stoneTypes = [
        {
            id: "granite",
            name: "Granit",
            description: "Doğal ve dayanıklı granit tezgah",
            colors: ["Siyah", "Gri", "Kahverengi", "Bej"],
            priceRange: "₺2,000 - ₺4,000 /m²"
        },
        {
            id: "marble",
            name: "Mermer",
            description: "Klasik ve şık mermer tezgah",
            colors: ["Beyaz", "Krem", "Gri", "Siyah"],
            priceRange: "₺1,500 - ₺3,500 /m²"
        },
        {
            id: "quartz",
            name: "Kuvars",
            description: "Modern ve dayanıklı kuvars tezgah",
            colors: ["Beyaz", "Gri", "Siyah", "Bej"],
            priceRange: "₺2,500 - ₺5,000 /m²"
        }
    ];

    const validateForm = () => {
        const newErrors = {};
        if (!stoneType) {
            newErrors.stoneType = "Lütfen bir taş türü seçin";
        }
        if (!dimensions.width || dimensions.width <= 0) {
            newErrors.width = "Geçerli bir genişlik girin";
        }
        if (!dimensions.height || dimensions.height <= 0) {
            newErrors.height = "Geçerli bir yükseklik girin";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            onNext(stoneType, dimensions);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Tezgah Malzemesi Seçimi
                    </h2>

                    {/* Taş Türü Seçimi */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Taş Türü</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {stoneTypes.map((stone) => (
                                <div
                                    key={stone.id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all
                                              ${stoneType === stone.id 
                                                ? 'ring-2 ring-blue-500 bg-blue-50' 
                                                : 'hover:shadow-md'}`}
                                    onClick={() => setStoneType(stone.id)}
                                >
                                    <h4 className="font-semibold text-lg">{stone.name}</h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {stone.description}
                                    </p>
                                    <div className="text-sm">
                                        <p className="mb-1">
                                            <span className="font-medium">Renkler: </span>
                                            {stone.colors.join(", ")}
                                        </p>
                                        <p>
                                            <span className="font-medium">Fiyat: </span>
                                            {stone.priceRange}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.stoneType && (
                            <p className="text-red-500 text-sm mt-1">{errors.stoneType}</p>
                        )}
                    </div>

                    {/* Boyut Girişi */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Tezgah Boyutları</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Genişlik (cm)
                                </label>
                                <input
                                    type="number"
                                    value={dimensions.width}
                                    onChange={(e) => setDimensions(prev => ({
                                        ...prev,
                                        width: parseInt(e.target.value)
                                    }))}
                                    className="w-full p-3 border rounded-md shadow-sm focus:ring-2 
                                             focus:ring-blue-500 focus:outline-none"
                                    placeholder="Genişlik girin"
                                />
                                {errors.width && (
                                    <p className="text-red-500 text-sm mt-1">{errors.width}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Yükseklik (cm)
                                </label>
                                <input
                                    type="number"
                                    value={dimensions.height}
                                    onChange={(e) => setDimensions(prev => ({
                                        ...prev,
                                        height: parseInt(e.target.value)
                                    }))}
                                    className="w-full p-3 border rounded-md shadow-sm focus:ring-2 
                                             focus:ring-blue-500 focus:outline-none"
                                    placeholder="Yükseklik girin"
                                />
                                {errors.height && (
                                    <p className="text-red-500 text-sm mt-1">{errors.height}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Devam Butonu */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleNext}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                                     transition-colors flex items-center gap-2"
                        >
                            <span>Devam Et</span>
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};