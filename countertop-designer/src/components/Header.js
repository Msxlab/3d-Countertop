// src/components/Header.js
import React from "react";

export const Header = ({ 
    date, 
    showGrid, 
    setShowGrid, 
    snapToGrid, 
    setSnapToGrid, 
    canUndo, 
    canRedo, 
    onUndo, 
    onRedo 
}) => {
    return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Sol Taraf: Logo ve Başlık */}
                    <div>
                        <h1 className="text-2xl font-bold">Tezgah Tasarım</h1>
                        <p className="text-sm opacity-80">{date.toLocaleTimeString()}</p>
                    </div>

                    {/* Orta: Grid Kontrolleri */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="showGrid"
                                checked={showGrid}
                                onChange={(e) => setShowGrid(e.target.checked)}
                                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                            />
                            <label htmlFor="showGrid" className="text-sm">
                                Grid Göster
                            </label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="snapToGrid"
                                checked={snapToGrid}
                                onChange={(e) => setSnapToGrid(e.target.checked)}
                                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                            />
                            <label htmlFor="snapToGrid" className="text-sm">
                                Grid'e Yapış
                            </label>
                        </div>
                    </div>

                    {/* Sağ Taraf: Undo/Redo */}
                    <div className="flex space-x-2">
                        <button
                            onClick={onUndo}
                            disabled={!canUndo}
                            className="px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800 
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     transition duration-150 ease-in-out"
                        >
                            <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                <span>Geri Al</span>
                            </span>
                        </button>

                        <button
                            onClick={onRedo}
                            disabled={!canRedo}
                            className="px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800 
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     transition duration-150 ease-in-out"
                        >
                            <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                          d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                                </svg>
                                <span>İleri Al</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};