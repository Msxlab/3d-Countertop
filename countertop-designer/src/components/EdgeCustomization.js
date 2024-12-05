// src/components/EdgeCustomization.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCountertopEdge } from '../store/slices/counterTopSlice';

const edgeProfiles = {
    straight: {
        name: 'Düz Kenar',
        price: 0,
        complexity: 1
    },
    beveled: {
        name: 'Pahlı Kenar',
        price: 25,
        complexity: 1.2
    },
    bullnose: {
        name: 'Yarım Yuvarlak',
        price: 35,
        complexity: 1.5
    },
    ogee: {
        name: 'Ogee',
        price: 45,
        complexity: 1.8
    },
    dupont: {
        name: 'Dupont',
        price: 55,
        complexity: 2
    },
    waterfall: {
        name: 'Şelale',
        price: 100,
        complexity: 2.5
    }
};

const materials = {
    granite: {
        name: 'Granit',
        basePrice: 100,
        textures: [
            { id: 'black-pearl', name: 'Black Pearl', price: 120 },
            { id: 'steel-grey', name: 'Steel Grey', price: 110 },
            { id: 'tan-brown', name: 'Tan Brown', price: 90 },
            { id: 'kashmir-white', name: 'Kashmir White', price: 130 }
        ]
    },
    marble: {
        name: 'Mermer',
        basePrice: 150,
        textures: [
            { id: 'calacatta', name: 'Calacatta', price: 200 },
            { id: 'carrara', name: 'Carrara', price: 180 },
            { id: 'emperador', name: 'Emperador', price: 160 },
            { id: 'travertine', name: 'Travertine', price: 140 }
        ]
    },
    quartz: {
        name: 'Kuvars',
        basePrice: 130,
        textures: [
            { id: 'pure-white', name: 'Pure White', price: 150 },
            { id: 'concrete', name: 'Concrete', price: 140 },
            { id: 'calacatta-gold', name: 'Calacatta Gold', price: 170 },
            { id: 'nero', name: 'Nero', price: 160 }
        ]
    }
};

export const EdgeCustomization = ({ selectedId }) => {
    const dispatch = useDispatch();
    const [selectedEdge, setSelectedEdge] = useState('straight');
    const [selectedMaterial, setSelectedMaterial] = useState('granite');
    const [selectedTexture, setSelectedTexture] = useState('');

    const handleEdgeChange = (edgeType) => {
        setSelectedEdge(edgeType);
        dispatch(updateCountertopEdge({
            id: selectedId,
            edge: edgeType,
            edgePrice: edgeProfiles[edgeType].price,
            complexity: edgeProfiles[edgeType].complexity
        }));
    };

    const handleMaterialChange = (materialType, textureId) => {
        setSelectedMaterial(materialType);
        setSelectedTexture(textureId);
        const material = materials[materialType];
        const texture = material.textures.find(t => t.id === textureId);
        
        dispatch(updateCountertopMaterial({
            id: selectedId,
            material: materialType,
            texture: textureId,
            basePrice: material.basePrice,
            texturePrice: texture?.price || 0
        }));
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Kenar ve Malzeme Özelleştirme</h3>
            
            {/* Kenar Profili Seçimi */}
            <div className="mb-6">
                <h4 className="font-medium mb-2">Kenar Profili</h4>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(edgeProfiles).map(([key, profile]) => (
                        <button
                            key={key}
                            onClick={() => handleEdgeChange(key)}
                            className={`p-2 border rounded ${
                                selectedEdge === key 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200'
                            }`}
                        >
                            <div className="text-sm font-medium">{profile.name}</div>
                            <div className="text-xs text-gray-500">
                                +₺{profile.price} / metre
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Malzeme ve Doku Seçimi */}
            <div>
                <h4 className="font-medium mb-2">Malzeme ve Doku</h4>
                <div className="space-y-4">
                    {Object.entries(materials).map(([key, material]) => (
                        <div key={key} className="border rounded p-3">
                            <div
                                className={`font-medium mb-2 ${
                                    selectedMaterial === key 
                                        ? 'text-blue-600' 
                                        : ''
                                }`}
                            >
                                {material.name}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {material.textures.map(texture => (
                                    <button
                                        key={texture.id}
                                        onClick={() => handleMaterialChange(key, texture.id)}
                                        className={`p-2 border rounded ${
                                            selectedMaterial === key && 
                                            selectedTexture === texture.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <div className="text-sm">{texture.name}</div>
                                        <div className="text-xs text-gray-500">
                                            ₺{texture.price}/m²
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};