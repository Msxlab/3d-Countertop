// src/components/SideMenu.js
import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setZoom } from '../store/slices/counterTopSlice';

export const SideMenu = () => {
    const dispatch = useDispatch();
    const { zoom } = useSelector(state => state.counterTop);

    const handleZoomIn = () => {
        dispatch(setZoom(Math.min(zoom * 1.2, 5)));
    };

    const handleZoomOut = () => {
        dispatch(setZoom(Math.max(zoom / 1.2, 0.2)));
    };

    const handleResetZoom = () => {
        dispatch(setZoom(1));
    };

    const tools = [
        {
            id: 'edge',
            name: 'Kenar Ekle',
            icon: '↔️',
            description: 'Tezgaha kenar ekle',
            color: 'green'
        },
        {
            id: 'cooktop',
            name: 'Ocak Ekle',
            icon: '🔥',
            description: 'Ocak alanı ekle',
            color: 'orange'
        },
        {
            id: 'sink',
            name: 'Evye Ekle',
            icon: '🚰',
            description: 'Evye alanı ekle',
            color: 'blue'
        },
        {
            id: 'measure',
            name: 'Ölçü Al',
            icon: '📏',
            description: 'Ölçü almak için tıklayın',
            color: 'purple'
        }
    ];

    return (
        <div className="w-64 bg-gray-100 dark:bg-gray-800 h-full flex flex-col p-4">
            {/* Başlık */}
            <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Araçlar
            </h3>

            {/* Zoom Kontrolleri */}
            <div className="space-y-2 mb-6">
                <button
                    onClick={handleZoomIn}
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                             transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    Yakınlaştır
                </button>

                <button
                    onClick={handleZoomOut}
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                             transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM5 10h14" />
                    </svg>
                    Uzaklaştır
                </button>

                <button
                    onClick={handleResetZoom}
                    className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600 
                             transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Sıfırla
                </button>
            </div>

            {/* Araçlar */}
            <div className="space-y-2">
                {tools.map(tool => (
                    <button
                        key={tool.id}
                        className={`w-full p-3 bg-${tool.color}-500 text-white rounded 
                                  hover:bg-${tool.color}-600 transition-colors flex items-center gap-3`}
                        title={tool.description}
                    >
                        <span className="text-xl">{tool.icon}</span>
                        <span>{tool.name}</span>
                    </button>
                ))}
            </div>

            {/* Alt Bilgi */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Zoom: {Math.round(zoom * 100)}%</p>
                </div>
            </div>
        </div>
    );
};