import React, { useEffect, useState } from 'react';
import { taskService } from '../services/taskService';
import Layout from '../components/Layout/Layout';

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        overdue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const tasks = await taskService.getTasks();
            const now = new Date();

            const completed = tasks.filter((t) => t.status === 'Completada').length;
            const inProgress = tasks.filter((t) => t.status === 'En Progreso').length;
            const pending = tasks.filter((t) => t.status === 'Pendiente').length;
            const overdue = tasks.filter(
                (t) =>
                    t.dueDate &&
                    new Date(t.dueDate) < now &&
                    t.status !== 'Completada'
            ).length;

            setStats({
                total: tasks.length,
                completed,
                inProgress,
                pending,
                overdue,
            });
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div>
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">General system overview</p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Tarjetas de Estadísticas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="card p-6 animate-fade-in">
                                <div className="flex items-center">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Tasks
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.total}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="card p-6 animate-fade-in"
                                style={{ animationDelay: '0.1s' }}
                            >
                                <div className="flex items-center">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Completed
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.completed}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="card p-6 animate-fade-in"
                                style={{ animationDelay: '0.2s' }}
                            >
                                <div className="flex items-center">
                                    <div className="p-3 bg-yellow-100 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-yellow-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            In Progress
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.inProgress}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="card p-6 animate-fade-in"
                                style={{ animationDelay: '0.3s' }}
                            >
                                <div className="flex items-center">
                                    <div className="p-3 bg-red-100 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Overdue
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.overdue}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta Informativa */}
                        <div className="card p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                🚀 Welcome to the Task Manager
                            </h2>
                            <p className="text-gray-600 mb-4">
                                A comprehensive solution to organize and track your work efficiently:
                            </p>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Create and organize tasks with priorities and due dates
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Group tasks into projects for better organization
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Track progress with real-time status updates
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Monitor productivity with detailed reports and statistics
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Stay on top of deadlines with overdue alerts
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Collaborate securely with user authentication
                                </li>
                            </ul>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <a href="/tasks" className="btn-primary">
                                    📝 Manage Tasks
                                </a>
                                <a href="/projects" className="btn-secondary">
                                    📁 Manage Projects
                                </a>
                            </div>
                        </div>

                        {/* Estadísticas Adicionales */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Status Distribution
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-600">Pending</span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {stats.pending}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-500 h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${stats.total > 0
                                                        ? (stats.pending / stats.total) * 100
                                                        : 0
                                                        }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-600">
                                                In Progress
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {stats.inProgress}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${stats.total > 0
                                                        ? (stats.inProgress / stats.total) * 100
                                                        : 0
                                                        }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-600">
                                                Completed
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {stats.completed}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${stats.total > 0
                                                        ? (stats.completed / stats.total) * 100
                                                        : 0
                                                        }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Quick Summary
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-700">
                                            Completion Rate
                                        </span>
                                        <span className="text-lg font-bold text-blue-600">
                                            {stats.total > 0
                                                ? Math.round((stats.completed / stats.total) * 100)
                                                : 0}
                                            %
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-700">
                                            Active Tasks
                                        </span>
                                        <span className="text-lg font-bold text-yellow-600">
                                            {stats.pending + stats.inProgress}
                                        </span>
                                    </div>

                                    {stats.overdue > 0 && (
                                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">
                                                ⚠️ Attention Required
                                            </span>
                                            <span className="text-lg font-bold text-red-600">
                                                {stats.overdue} overdue
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default DashboardPage;
