import React, { useEffect, useState } from 'react';
import { projectService, Project } from '../services/projectService';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error: any) {
            toast.error('Error al cargar proyectos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (selectedProject) {
                await projectService.updateProject(selectedProject._id, formData);
                toast.success('Proyecto actualizado correctamente');
            } else {
                await projectService.createProject(formData);
                toast.success('Proyecto creado correctamente');
            }
            resetForm();
            loadProjects();
            setIsFormOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al guardar proyecto');
        }
    };

    const handleEdit = (project: Project) => {
        setSelectedProject(project);
        setFormData({
            name: project.name,
            description: project.description,
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar este proyecto?')) return;

        try {
            await projectService.deleteProject(id);
            toast.success('Proyecto eliminado correctamente');
            loadProjects();
        } catch (error: any) {
            toast.error('Error al eliminar proyecto');
        }
    };

    const resetForm = () => {
        setSelectedProject(null);
        setFormData({
            name: '',
            description: '',
        });
    };

    return (
        <Layout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setIsFormOpen(true);
                        }}
                        className="btn-primary"
                    >
                        + Nuevo Proyecto
                    </button>
                </div>

                {/* Formulario Modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="card max-w-lg w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {selectedProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsFormOpen(false);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre del Proyecto *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input-field"
                                        rows={4}
                                        placeholder="Describe el proyecto..."
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsFormOpen(false);
                                            resetForm();
                                        }}
                                        className="btn-secondary"
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        {selectedProject ? 'Actualizar' : 'Crear'} Proyecto
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Lista de Proyectos */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="card p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-lg">No hay proyectos creados</p>
                        <p className="text-gray-500 text-sm mt-2">Crea tu primer proyecto haciendo clic en "Nuevo Proyecto"</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project._id} className="card p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {project.description || 'Sin descripción'}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-500 mb-4">
                                    Creado: {new Date(project.createdAt).toLocaleDateString()}
                                </div>

                                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project._id)}
                                        className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ProjectsPage;
