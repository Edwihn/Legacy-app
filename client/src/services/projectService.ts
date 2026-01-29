import api from './api';

export interface Project {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export const projectService = {
    /**
     * Obtener todos los proyectos
     */
    getProjects: async (): Promise<Project[]> => {
        const response = await api.get('/projects');
        return response.data.data;
    },

    /**
     * Obtener proyecto por ID
     */
    getProjectById: async (id: string): Promise<Project> => {
        const response = await api.get(`/projects/${id}`);
        return response.data.data;
    },

    /**
     * Crear proyecto
     */
    createProject: async (data: { name: string; description: string }): Promise<Project> => {
        const response = await api.post('/projects', data);
        return response.data.data;
    },

    /**
     * Actualizar proyecto
     */
    updateProject: async (id: string, data: { name: string; description: string }): Promise<Project> => {
        const response = await api.put(`/projects/${id}`, data);
        return response.data.data;
    },

    /**
     * Eliminar proyecto
     */
    deleteProject: async (id: string): Promise<void> => {
        await api.delete(`/projects/${id}`);
    },
};
