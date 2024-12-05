// src/components/InteractiveElements.js
import React, { useState } from "react";

export const InteractiveElements = ({ elements, onAddElement, onUpdateElement }) => {
    const [selectedElement, setSelectedElement] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editingElement, setEditingElement] = useState(null);

    const elementTypes = {
        edge: {
            name: "Kenar",
            icon: "🔲",
            basePrice: 50
        },
        cooktop: {
            name: "Ocak",
            icon: "🔥",
            basePrice: 100
        },
        sink: {
            name: "Evye",
            icon: "🚰",
            basePrice: 150
        }
    };

    const handleAddElement = (type) => {
        const newElement = {
            id: Date.now(),
            type,
            name: `${elementTypes[type].name} ${elements.length + 1}`,
            price: elementTypes[type].basePrice,
            dimensions: {
                width: 20,
                height: 20
            },
            position: {
                x: 0,
                y: 0
            }
        };
        onAddElement(newElement);
    };

    const handleEdit = (element) => {
        setEditingElement(element);
        setEditMode(true);
    };

    const handleSaveEdit = () => {
        if (editingElement) {
            onUpdateElement(editingElement.id, editingElement);
            setEditMode(false);
            setEditingElement(null);
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">İnteraktif Elemanlar</h2>

            {/* Eleman Ekleme Butonları */}
            <div className="flex gap-2 mb-4">
                {Object.entries(elementTypes).map(([type, info]) => (
                    <button
                        key={type}
                        onClick={() => handleAddElement(type)}
                        className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded 
                                 hover:bg-blue-600 transition-colors"
                    >
                        <span>{info.icon}</span>
                        <span>{info.name} Ekle</span>
                    </button>
                ))}
            </div>

            {/* Eleman Listesi */}
            <div className="space-y-2">
                {elements.map((element) => (
                    <div
                        key={element.id}
                        className={`p-3 bg-white rounded shadow-sm hover:shadow
                                 ${selectedElement === element.id ? 'ring-2 ring-blue-500' : ''}
                                 cursor-pointer transition-all`}
                        onClick={() => setSelectedElement(element.id)}
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span>{elementTypes[element.type].icon}</span>
                                <span className="font-medium">{element.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(element);
                                    }}
                                    className="p-1 text-blue-500 hover:text-blue-600"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUpdateElement(element.id, null);
                                    }}
                                    className="p-1 text-red-500 hover:text-red-600"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>

                        <div className="mt-2 text-sm text-gray-600">
                            <div>Boyut: {element.dimensions.width}" x {element.dimensions.height}"</div>
                            <div>Fiyat: ${element.price}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Düzenleme Modal */}
            {editMode && editingElement && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Eleman Düzenle</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">İsim</label>
                                <input
                                    type="text"
                                    value={editingElement.name}
                                    onChange={(e) => setEditingElement({
                                        ...editingElement,
                                        name: e.target.value
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Genişlik</label>
                                    <input
                                        type="number"
                                        value={editingElement.dimensions.width}
                                        onChange={(e) => setEditingElement({
                                            ...editingElement,
                                            dimensions: {
                                                ...editingElement.dimensions,
                                                width: Number(e.target.value)
                                            }
                                        })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Yükseklik</label>
                                    <input
                                        type="number"
                                        value={editingElement.dimensions.height}
                                        onChange={(e) => setEditingElement({
                                            ...editingElement,
                                            dimensions: {
                                                ...editingElement.dimensions,
                                                height: Number(e.target.value)
                                            }
                                        })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fiyat</label>
                                <input
                                    type="number"
                                    value={editingElement.price}
                                    onChange={(e) => setEditingElement({
                                        ...editingElement,
                                        price: Number(e.target.value)
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => {
                                        setEditMode(false);
                                        setEditingElement(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};