import React, { useEffect, useState } from 'react';
import { taskService, Task } from '../services/taskService';
import { projectService, Project } from '../services/projectService';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import HistoryViewer from '../components/Tasks/HistoryViewer';

import { authService } from '../services/authService';

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

const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [historyTaskId, setHistoryTaskId] = useState<string | null>(null);

    // Search filters
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
        projectId: '',
        assignedTo: '',
    });

    // Form states
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Pendiente' as const,
        priority: 'Media' as const,
        projectId: '',
        assignedTo: '',
        dueDate: '',
        estimatedHours: 0,
    });

    useEffect(() => {
        loadTasks();
        loadProjects();
        loadUsers();
    }, [filters]); // Recargar cuando cambien los filtros

    const loadTasks = async () => {
        try {
            setLoading(true);
            // Convertir filtros vacíos a undefined para no enviarlos
            const activeFilters: any = {};
            Object.keys(filters).forEach(key => {
                if ((filters as any)[key]) activeFilters[key] = (filters as any)[key];
            });

            const data = await taskService.getTasks(activeFilters);
            setTasks(data);
        } catch (error: any) {
            toast.error('Error loading tasks');
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const data = await authService.getUsers();
            setUsers(data);
        } catch (error: any) {
            console.error('Error loading users', error);
        }
    };

    const loadProjects = async () => {
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error: any) {
            toast.error('Error loading projects');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log('Saving task...', { selectedTask, formData });

            if (selectedTask) {
                await taskService.updateTask(selectedTask._id, formData);
                toast.success('Task updated successfully');
            } else {
                await taskService.createTask(formData);
                toast.success('Task created successfully');
            }
            resetForm();
            loadTasks();
            setIsFormOpen(false);
        } catch (error: any) {
            console.error('Error saving task:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error saving task';
            toast.error(errorMessage);
        }
    };


    const handleEdit = (task: Task) => {
        setSelectedTask(task);

        // Manejar projectId - puede ser un objeto o un string
        let projectIdValue = '';
        if (typeof task.projectId === 'object' && task.projectId !== null) {
            projectIdValue = task.projectId._id || '';
        } else if (typeof task.projectId === 'string') {
            projectIdValue = task.projectId;
        }

        // Manejar assignedTo - puede ser un objeto, string, o null
        let assignedToValue = '';
        if (task.assignedTo) {
            if (typeof task.assignedTo === 'object' && task.assignedTo !== null) {
                assignedToValue = task.assignedTo._id || '';
            } else if (typeof task.assignedTo === 'string') {
                assignedToValue = task.assignedTo;
            }
        }

        setFormData({
            title: task.title || '',
            description: task.description || '',
            status: task.status as any,
            priority: task.priority as any,
            projectId: projectIdValue,
            assignedTo: assignedToValue,
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
            estimatedHours: task.estimatedHours || 0,
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await taskService.deleteTask(id);
            toast.success('Task deleted successfully');
            loadTasks();
        } catch (error: any) {
            toast.error('Error deleting task');
        }
    };

    const resetForm = () => {
        setSelectedTask(null);
        setFormData({
            title: '',
            description: '',
            status: 'Pendiente',
            priority: 'Media',
            projectId: '',
            assignedTo: '',
            dueDate: '',
            estimatedHours: 0,
        });
    };

    const getStatusBadgeClass = (status: string) => {
        const classes: Record<string, string> = {
            'Pendiente': 'badge-pendiente',
            'En Progreso': 'badge-en-progreso',
            'Completada': 'badge-completada',
            'Bloqueada': 'badge-bloqueada',
            'Cancelada': 'bg-gray-100 text-gray-700',
        };
        return classes[status] || 'badge-pendiente';
    };

    const getPriorityBadgeClass = (priority: string) => {
        const classes: Record<string, string> = {
            'Baja': 'badge-priority-baja',
            'Media': 'badge-priority-media',
            'Alta': 'badge-priority-alta',
            'Crítica': 'badge-priority-critica',
        };
        return classes[priority] || 'badge-priority-media';
    };

    return (
        <Layout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-100">Task Management</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setIsFormOpen(true);
                        }}
                        className="btn-primary"
                    >
                        + New Task
                    </button>
                </div>

                {/* Filtros Avanzados */}
                <div className="bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-700 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Búsqueda por texto */}
                        <div className="lg:col-span-1">
                            <input
                                type="text"
                                placeholder="Search by title or desc..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="input-field"
                            />
                        </div>

                        {/* Filtro Estado */}
                        <div>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="input-field"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pendiente">Pending</option>
                                <option value="En Progreso">In Progress</option>
                                <option value="Completada">Completed</option>
                                <option value="Bloqueada">Blocked</option>
                                <option value="Cancelada">Cancelled</option>
                            </select>
                        </div>

                        {/* Filtro Prioridad */}
                        <div>
                            <select
                                value={filters.priority}
                                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                                className="input-field"
                            >
                                <option value="">All Priorities</option>
                                <option value="Baja">Low</option>
                                <option value="Media">Medium</option>
                                <option value="Alta">High</option>
                                <option value="Crítica">Critical</option>
                            </select>
                        </div>

                        {/* Filtro Proyecto */}
                        <div>
                            <select
                                value={filters.projectId}
                                onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
                                className="input-field"
                            >
                                <option value="">All Projects</option>
                                {projects.map(project => (
                                    <option key={project._id} value={project._id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro Asignado */}
                        <div>
                            <select
                                value={filters.assignedTo}
                                onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
                                className="input-field"
                            >
                                <option value="">All Users</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Botón de limpiar si hay filtros activos */}
                    {(filters.search || filters.status || filters.priority || filters.projectId || filters.assignedTo) && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setFilters({
                                    search: '',
                                    status: '',
                                    priority: '',
                                    projectId: '',
                                    assignedTo: '',
                                })}
                                className="text-sm text-red-600 hover:text-red-800 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Formulario Modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-100">
                                    {selectedTask ? 'Edit Task' : 'New Task'}
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
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input-field"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                            className="input-field"
                                        >
                                            <option value="Pendiente">Pending</option>
                                            <option value="En Progreso">In Progress</option>
                                            <option value="Completada">Completed</option>
                                            <option value="Bloqueada">Blocked</option>
                                            <option value="Cancelada">Cancelled</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Priority
                                        </label>
                                        <select
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                            className="input-field"
                                        >
                                            <option value="Baja">Low</option>
                                            <option value="Media">Medium</option>
                                            <option value="Alta">High</option>
                                            <option value="Crítica">Critical</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Project *
                                    </label>
                                    <select
                                        value={formData.projectId}
                                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Select project</option>
                                        {projects.map((project) => (
                                            <option key={project._id} value={project._id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Assigned To
                                    </label>
                                    <select
                                        value={formData.assignedTo}
                                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Due Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Estimated Hours
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.estimatedHours}
                                            onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) })}
                                            className="input-field"
                                            min="0"
                                            step="0.5"
                                        />
                                    </div>
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
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        {selectedTask ? 'Update' : 'Create'} Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Lista de Tareas */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="card p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-gray-400 text-lg">No tasks found</p>
                        <p className="text-gray-500 text-sm mt-2">Create your first task by clicking "New Task"</p>
                    </div>
                ) : (
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-slate-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Task
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Priority
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Project
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Assigned To
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Due Date
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-slate-800 divide-y divide-slate-700">
                                    {tasks.map((task) => (
                                        <tr key={task._id} className="hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-100">{task.title}</div>
                                                    {task.description && (
                                                        <div className="text-sm text-gray-500 truncate max-w-md">
                                                            {task.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                                                    {translateStatus(task.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                                                    {translatePriority(task.priority)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                                                {task.projectId?.name || 'No Project'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600 mr-2">
                                                        {(task.assignedTo?.username || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    {task.assignedTo?.username || 'Unassigned'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => setHistoryTaskId(task._id)}
                                                    className="text-purple-600 hover:text-purple-900 mr-3"
                                                    title="View History"
                                                >
                                                    📜 History
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(task)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(task._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Historial */}
            {historyTaskId && (
                <HistoryViewer
                    taskId={historyTaskId}
                    onClose={() => setHistoryTaskId(null)}
                />
            )}
        </Layout>
    );
};

export default TasksPage;
