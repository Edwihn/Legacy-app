import api from './api';

export interface DashboardStats {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    overdue: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
}

export interface ProjectStats {
    totalProjects: number;
    projects: Array<{
        projectId: string;
        projectName: string;
        totalTasks: number;
        completed: number;
        pending: number;
        inProgress: number;
    }>;
}

export const reportService = {
    /**
     * Obtener estadísticas de tareas
     */
    getTaskStats: async (): Promise<DashboardStats> => {
        const response = await api.get('/reports/tasks');
        return response.data.data;
    },

    /**
     * Obtener estadísticas de proyectos
     */
    getProjectStats: async (): Promise<ProjectStats> => {
        const response = await api.get('/reports/projects');
        return response.data.data;
    },

    /**
     * Exportar tareas a CSV
     */
    exportTasksToCSV: async (): Promise<Blob> => {
        const response = await api.get('/reports/export-csv', {
            responseType: 'blob',
        });
        return response.data;
    },
};
