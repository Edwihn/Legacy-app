import api from './api';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    email?: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: {
        id: string;
        username: string;
        email?: string;
        role: string;
    };
}

/**
 * Servicio de autenticación
 */
export const authService = {
    /**
     * Login de usuario
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    /**
     * Registro de usuario
     */
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    /**
     * Logout
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    /**
     * Obtener usuario actual
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Verificar si está autenticado
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },
};
