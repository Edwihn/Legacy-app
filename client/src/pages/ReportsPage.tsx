import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { reportService, DashboardStats, ProjectStats } from '../services/reportService';
import toast from 'react-hot-toast';

const translateStatus = (status: string) => {
    const map: Record<string, string> = {
        'Pendiente': 'Pending',
        'En Progreso': 'In Progress',
        'Completada': 'Completed',
        'Bloqueada': 'Blocked',
        'Cancelada': 'Cancelled'
    };
    return map[status] || status;
};

const translatePriority = (priority: string) => {
    const map: Record<string, string> = {
        'Baja': 'Low',
        'Media': 'Medium',
        'Alta': 'High',
        'Crítica': 'Critical'
    };
    return map[priority] || priority;
};

const ReportsPage: React.FC = () => {
    const [taskStats, setTaskStats] = useState<DashboardStats | null>(null);
    const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [tasksData, projectsData] = await Promise.all([
                reportService.getTaskStats(),
                reportService.getProjectStats()
            ]);
            setTaskStats(tasksData);
            setProjectStats(projectsData);
        } catch (error) {
            console.error(error);
            toast.error('Error loading reports');
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = async () => {
        try {
            const blob = await reportService.exportTasksToCSV();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tasks_report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Report downloaded successfully');
        } catch (error) {
            toast.error('Error downloading CSV');
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-100">Reports Panel</h1>
                    <button
                        onClick={handleExportCSV}
                        className="btn-secondary flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export to CSV
                    </button>
                </div>

                {/* Métricas Generales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-700">
                        <div className="text-gray-500 text-sm font-medium uppercase">Total Tasks</div>
                        <div className="mt-2 flex items-baseline">
                            <span className="text-3xl font-bold text-gray-100">{taskStats?.total || 0}</span>
                        </div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-700">
                        <div className="text-gray-500 text-sm font-medium uppercase">Completed</div>
                        <div className="mt-2 flex items-baseline">
                            <span className="text-3xl font-bold text-green-600">{taskStats?.completed || 0}</span>
                            <span className="ml-2 text-sm text-gray-400">
                                ({taskStats?.total ? Math.round(((taskStats?.completed || 0) / taskStats.total) * 100) : 0}%)
                            </span>
                        </div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-700">
                        <div className="text-gray-500 text-sm font-medium uppercase">Pending</div>
                        <div className="mt-2 flex items-baseline">
                            <span className="text-3xl font-bold text-yellow-600">{taskStats?.pending || 0}</span>
                        </div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-700">
                        <div className="text-gray-500 text-sm font-medium uppercase">Overdue</div>
                        <div className="mt-2 flex items-baseline">
                            <span className="text-3xl font-bold text-red-600">{taskStats?.overdue || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico de Barras: Estado */}
                    <div className="bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-700">
                        <h3 className="text-lg font-semibold text-gray-100 mb-4">Tasks by Status</h3>
                        <div className="space-y-4">
                            {Object.entries(taskStats?.byStatus || {}).map(([status, count]) => (
                                <div key={status}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-300">{translateStatus(status)}</span>
                                        <span className="text-gray-600">{count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${status === 'Completada' ? 'bg-green-500' :
                                                status === 'En Progreso' ? 'bg-blue-700' :
                                                    status === 'Pendiente' ? 'bg-yellow-400' : 'bg-gray-500'
                                                }`}
                                            style={{ width: `${taskStats?.total ? (count / taskStats.total) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gráfico de Barras: Prioridad */}
                    <div className="bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-700">
                        <h3 className="text-lg font-semibold text-gray-100 mb-4">Tasks by Priority</h3>
                        <div className="space-y-4">
                            {Object.entries(taskStats?.byPriority || {}).map(([priority, count]) => (
                                <div key={priority}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-300">{translatePriority(priority)}</span>
                                        <span className="text-gray-600">{count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${priority === 'Alta' || priority === 'Crítica' ? 'bg-red-500' :
                                                priority === 'Media' ? 'bg-yellow-500' : 'bg-blue-600'
                                                }`}
                                            style={{ width: `${taskStats?.total ? (count / taskStats.total) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabla de Progreso de Proyectos */}
                <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-700">
                        <h3 className="text-lg font-semibold text-gray-100">Progress by Project</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tasks</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-800 divide-y divide-slate-700">
                                {projectStats?.projects.map((proj) => {
                                    const progress = proj.totalTasks ? Math.round((proj.completed / proj.totalTasks) * 100) : 0;
                                    return (
                                        <tr key={proj.projectId}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-100">{proj.projectName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{proj.totalTasks}</td>
                                            <td className="px-6 py-4 whitespace-nowrap align-middle">
                                                <div className="flex items-center">
                                                    <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mr-2">
                                                        <div
                                                            className="bg-blue-800 h-2.5 rounded-full"
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600">{progress}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{proj.pending}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ReportsPage;
