import api from './api';

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'Pendiente' | 'En Progreso' | 'Completada' | 'Bloqueada' | 'Cancelada';
    priority: 'Baja' | 'Media' | 'Alta' | 'Crítica';
    projectId: any;
    assignedTo: any;
    createdBy: any;
    dueDate: string | null;
    estimatedHours: number;
    actualHours: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskData {
    title: string;
    description: string;
    status?: string;
    priority?: string;
    projectId: string;
    assignedTo?: string;
    dueDate?: string;
    estimatedHours?: number;
}

export const taskService = {
    /**
     * Obtener todas las tareas
     */
    getTasks: async (filters?: any): Promise<Task[]> => {
        const response = await api.get('/tasks', { params: filters });
        return response.data.data;
    },

    /**
     * Obtener tarea por ID
     */
    getTaskById: async (id: string): Promise<Task> => {
        const response = await api.get(`/tasks/${id}`);
        return response.data.data;
    },

    /**
     * Crear tarea
     */
    createTask: async (data: CreateTaskData): Promise<Task> => {
        const response = await api.post('/tasks', data);
        return response.data.data;
    },

    /**
     * Actualizar tarea
     */
    updateTask: async (id: string, data: Partial<CreateTaskData>): Promise<Task> => {
        const response = await api.put(`/tasks/${id}`, data);
        return response.data.data;
    },

    /**
     * Eliminar tarea
     */
    deleteTask: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },

    /**
     * Búsqueda avanzada
     */
    searchTasks: async (searchParams: any): Promise<Task[]> => {
        const response = await api.post('/tasks/search', searchParams);
        return response.data.data;
    },
};
