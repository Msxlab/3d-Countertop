// src/components/TemplateSystem.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadTemplate } from '../store/slices/counterTopSlice';

export const TemplateSystem = () => {
    const dispatch = useDispatch();
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const currentCountertops = useSelector(state => state.counterTop.countertops);

    // Hazır şablonlar
    const defaultTemplates = [
        {
            id: 'L-shaped',
            name: 'L Şeklinde Tezgah',
            description: 'Mutfak köşesi için L şeklinde tezgah tasarımı',
            thumbnail: '🔲',
            countertops: [
                {
                    id: 1,
                    width: 72,
                    height: 24,
                    depth: 1.5,
                    x: 0,
                    y: 0,
                    rotation: 0,
                    color: "#e0e0e0",
                    pattern: "marble"
                },
                {
                    id: 2,
                    width: 24,
                    height: 72,
                    depth: 1.5,
                    x: 72,
                    y: 24,
                    rotation: 90,
                    color: "#e0e0e0",
                    pattern: "marble"
                }
            ]
        },
        {
            id: 'U-shaped',
            name: 'U Şeklinde Tezgah',
            description: 'Büyük mutfaklar için U şeklinde tezgah tasarımı',
            thumbnail: '🔲',
            countertops: [
                {
                    id: 1,
                    width: 72,
                    height: 24,
                    depth: 1.5,
                    x: 0,
                    y: 0,
                    rotation: 0,
                    color: "#e0e0e0",
                    pattern: "marble"
                },
                {
                    id: 2,
                    width: 72,
                    height: 24,
                    depth: 1.5,
                    x: 72,
                    y: 72,
                    rotation: 90,
                    color: "#e0e0e0",
                    pattern: "marble"
                },
                {
                    id: 3,
                    width: 72,
                    height: 24,
                    depth: 1.5,
                    x: 144,
                    y: 0,
                    rotation: 0,
                    color: "#e0e0e0",
                    pattern: "marble"
                }
            ]
        }
    ];

    useEffect(() => {
        // Yerel depolamadan şablonları yükle
        const savedTemplates = localStorage.getItem('countertopTemplates');
        if (savedTemplates) {
            setTemplates([...defaultTemplates, ...JSON.parse(savedTemplates)]);
        } else {
            setTemplates(defaultTemplates);
        }
    }, []);

    const handleSaveTemplate = () => {
        if (!newTemplateName.trim()) {
            alert('Lütfen şablon adı girin');
            return;
        }

        const newTemplate = {
            id: Date.now().toString(),
            name: newTemplateName,
            description: 'Özel şablon',
            thumbnail: '🔲',
            countertops: currentCountertops,
            createdAt: new Date().toISOString()
        };

        const updatedTemplates = [...templates, newTemplate];
        setTemplates(updatedTemplates);
        localStorage.setItem('countertopTemplates', JSON.stringify(
            updatedTemplates.filter(t => !defaultTemplates.find(dt => dt.id === t.id))
        ));
        setShowSaveDialog(false);
        setNewTemplateName('');
    };

    const handleLoadTemplate = (template) => {
        dispatch(loadTemplate(template.countertops));
        setSelectedTemplate(template.id);
    };

    const handleDeleteTemplate = (templateId) => {
        if (defaultTemplates.find(t => t.id === templateId)) {
            alert('Varsayılan şablonlar silinemez');
            return;
        }

        if (!window.confirm('Bu şablonu silmek istediğinizden emin misiniz?')) {
            return;
        }

        const updatedTemplates = templates.filter(t => t.id !== templateId);
        setTemplates(updatedTemplates);
        localStorage.setItem('countertopTemplates', JSON.stringify(
            updatedTemplates.filter(t => !defaultTemplates.find(dt => dt.id === t.id))
        ));
    };

    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* Üst Bar */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Şablonlar</h2>
                <button
                    onClick={() => setShowSaveDialog(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Şablon Olarak Kaydet
                </button>
            </div>

            {/* Arama */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Şablon ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 
                             focus:outline-none"
                />
            </div>

            {/* Kaydetme Dialog */}
            {showSaveDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center 
                              justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h3 className="text-lg font-semibold mb-4">Şablon Kaydet</h3>
                        <input
                            type="text"
                            placeholder="Şablon adı"
                            value={newTemplateName}
                            onChange={(e) => setNewTemplateName(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowSaveDialog(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSaveTemplate}
                                className="px-4 py-2 bg-blue-500 text-white rounded 
                                         hover:bg-blue-600"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Şablon Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map(template => (
                    <div
                        key={template.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all
                                 ${selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''}
                                 hover:shadow-md`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{template.name}</h3>
                            {!defaultTemplates.find(t => t.id === template.id) && (
                                <button
                                    onClick={() => handleDeleteTemplate(template.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="text-center text-4xl mb-2">{template.thumbnail}</div>
                        <button
                            onClick={() => handleLoadTemplate(template)}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded 
                                     hover:bg-blue-600"
                        >
                            Bu Şablonu Kullan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};