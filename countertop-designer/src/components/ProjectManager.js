// src/components/ProjectManager.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { projectService } from '../services/projectService';

export const ProjectManager = () => {
    const dispatch = useDispatch();
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);

    const currentState = useSelector(state => ({
        countertops: state.counterTop.countertops,
        customerInfo: state.counterTop.customerInfo
    }));

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setIsLoading(true);
        try {
            const userProjects = await projectService.getUserProjects();
            setProjects(userProjects);
        } catch (error) {
            console.error('Projeler yüklenirken hata:', error);
            alert('Projeler yüklenirken bir hata oluştu.');
        }
        setIsLoading(false);
    };

    const handleSaveProject = async () => {
        if (!projectName.trim()) {
            alert('Lütfen proje adı girin.');
            return;
        }

        setIsLoading(true);
        try {
            const projectData = {
                name: projectName,
                ...currentState,
                createdAt: new Date().toISOString()
            };

            await projectService.saveProject(projectData);
            await loadProjects();
            setShowSaveDialog(false);
            setProjectName('');
            alert('Proje başarıyla kaydedildi.');
        } catch (error) {
            console.error('Proje kaydedilirken hata:', error);
            alert('Proje kaydedilirken bir hata oluştu.');
        }
        setIsLoading(false);
    };

    const handleLoadProject = async (project) => {
        setIsLoading(true);
        try {
            const projectData = await projectService.loadProject(project.id);
            dispatch({ type: 'counterTop/loadProject', payload: projectData });
            setSelectedProject(project.id);
            alert('Proje başarıyla yüklendi.');
        } catch (error) {
            console.error('Proje yüklenirken hata:', error);
            alert('Proje yüklenirken bir hata oluştu.');
        }
        setIsLoading(false);
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            {/* Üst Bar */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Projeler</h2>
                <button
                    onClick={() => setShowSaveDialog(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                             transition-colors"
                >
                    Projeyi Kaydet
                </button>
            </div>

            {/* Arama */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Proje ara..."
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
                        <h3 className="text-lg font-semibold mb-4">Projeyi Kaydet</h3>
                        <input
                            type="text"
                            placeholder="Proje adı"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
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
                                onClick={handleSaveProject}
                                className="px-4 py-2 bg-blue-500 text-white rounded 
                                         hover:bg-blue-600"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Proje Listesi */}
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map(project => (
                        <div
                            key={project.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all
                                     ${selectedProject === project.id ? 'ring-2 ring-blue-500' : ''} 
                                     hover:shadow-md`}
                            onClick={() => handleLoadProject(project)}
                        >
                            {project.thumbnail && (
                                <img
                                    src={project.thumbnail}
                                    alt={project.name}
                                    className="w-full h-32 object-cover rounded mb-2"
                                />
                            )}
                            <h3 className="font-medium">{project.name}</h3>
                            <p className="text-sm text-gray-500">
                                {new Date(project.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                            <p className="text-sm text-gray-500">
                                Müşteri: {project.customerInfo?.name || 'Belirtilmemiş'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};