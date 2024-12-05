// src/components/ControlPanel.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCountertopDimensions, rotateCountertop } from '../store/slices/counterTopSlice';

export const ControlPanel = () => {
    const dispatch = useDispatch();
    const { activeId, countertops } = useSelector(state => state.counterTop);
    const activeCountertop = countertops.find(c => c.id === activeId);

    if (!activeCountertop) return null;

    const handleDimensionChange = (dimension, value) => {
        dispatch(updateCountertopDimensions({
            id: activeId,
            ...activeCountertop,
            [dimension]: Number(value)
        }));
    };

    const handleRotation = (angle) => {
        dispatch(rotateCountertop({
            id: activeId,
            angle: Number(angle)
        }));
    };

    return (
        <div className="w-64 p-4 bg-gray-100 flex flex-col gap-4">
            <div className="bg-white p-4 rounded shadow">
                <h4 className="font-bold mb-2">Boyutlar</h4>
                {['width', 'height', 'depth'].map(dim => (
                    <div key={dim} className="mb-2">
                        <label className="block mb-1">
                            {dim === 'width' ? 'Genişlik' : dim === 'height' ? 'Yükseklik' : 'Derinlik'}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="range"
                                min="2"
                                max="100"
                                value={activeCountertop[dim]}
                                onChange={(e) => handleDimensionChange(dim, e.target.value)}
                                className="w-full"
                            />
                            <input
                                type="number"
                                value={activeCountertop[dim]}
                                onChange={(e) => handleDimensionChange(dim, e.target.value)}
                                className="w-20 border rounded px-2"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h4 className="font-bold mb-2">Döndürme</h4>
                <input
                    type="range"
                    min="0"
                    max="360"
                    value={activeCountertop.rotation || 0}
                    onChange={(e) => handleRotation(e.target.value)}
                    className="w-full"
                />
                <div className="text-center mt-1">
                    {activeCountertop.rotation || 0}°
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h4 className="font-bold mb-2">Kenar Yuvarlaklığı</h4>
                <input
                    type="range"
                    min="0"
                    max="20"
                    value={activeCountertop.borderRadius || 0}
                    onChange={(e) => handleDimensionChange('borderRadius', e.target.value)}
                    className="w-full"
                />
            </div>
        </div>
    );
};