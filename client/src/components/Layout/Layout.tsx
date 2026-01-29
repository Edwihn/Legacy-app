import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const user = authService.getCurrentUser();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-8">
                            <Link to="/dashboard" className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <span className="ml-3 text-xl font-bold text-gray-900">Task Manager</span>
                            </Link>

                            <nav className="hidden md:flex space-x-1">
                                <Link
                                    to="/dashboard"
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/dashboard')
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/tasks"
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/tasks')
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Tareas
                                </Link>
                                <Link
                                    to="/projects"
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/projects')
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Proyectos
                                </Link>
                            </nav>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                                <p className="text-xs text-gray-500">{user?.role}</p>
                            </div>
                            <button
                                onClick={() => authService.logout()}
                                className="btn-danger"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
