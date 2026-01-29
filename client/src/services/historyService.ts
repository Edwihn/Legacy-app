import api from './api';

export interface HistoryEntry {
    _id: string;
    taskId: string;
    userId: {
        _id: string;
        username: string;
    };
    action: 'CREATED' | 'UPDATED' | 'STATUS_CHANGED' | 'ASSIGNED' | 'COMPLETED' | 'DELETED';
    changes: Record<string, any>;
    createdAt: string;
}

export const historyService = {
    /**
     * Obtener historial de una tarea específica
     */
    getTaskHistory: async (taskId: string): Promise<HistoryEntry[]> => {
        const response = await api.get(`/history/task/${taskId}`);
        return response.data.data;
    },

    /**
     * Obtener todo el historial
     */
    getAllHistory: async (): Promise<HistoryEntry[]> => {
        const response = await api.get('/history');
        return response.data.data;
    },
};
