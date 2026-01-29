import React, { useEffect, useState } from 'react';
import { taskService, Task } from '../services/taskService';
import { projectService, Project } from '../services/projectService';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import HistoryViewer from '../components/Tasks/HistoryViewer';

import { authService } from '../services/authService';

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
            toast.error('Error al cargar tareas');
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const data = await authService.getUsers();
            setUsers(data);
        } catch (error: any) {
            console.error('Error cargando usuarios', error);
        }
    };

    const loadProjects = async () => {
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error: any) {
            toast.error('Error al cargar proyectos');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log('Guardando tarea...', { selectedTask, formData });

            if (selectedTask) {
                await taskService.updateTask(selectedTask._id, formData);
                toast.success('Tarea actualizada correctamente');
            } else {
                await taskService.createTask(formData);
                toast.success('Tarea creada correctamente');
            }
            resetForm();
            loadTasks();
            setIsFormOpen(false);
        } catch (error: any) {
            console.error('Error al guardar tarea:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error al guardar tarea';
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
        if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;

        try {
            await taskService.deleteTask(id);
            toast.success('Tarea eliminada correctamente');
            loadTasks();
        } catch (error: any) {
            toast.error('Error al eliminar tarea');
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
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Tareas</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setIsFormOpen(true);
                        }}
                        className="btn-primary"
                    >
                        + Nueva Tarea
                    </button>
                </div>

                {/* Filtros Avanzados */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Búsqueda por texto */}
                        <div className="lg:col-span-1">
                            <input
                                type="text"
                                placeholder="Buscar por título o desc..."
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
                                <option value="">Todos los Estados</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="En Progreso">En Progreso</option>
                                <option value="Completada">Completada</option>
                                <option value="Bloqueada">Bloqueada</option>
                                <option value="Cancelada">Cancelada</option>
                            </select>
                        </div>

                        {/* Filtro Prioridad */}
                        <div>
                            <select
                                value={filters.priority}
                                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Todas las Prioridades</option>
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                                <option value="Crítica">Crítica</option>
                            </select>
                        </div>

                        {/* Filtro Proyecto */}
                        <div>
                            <select
                                value={filters.projectId}
                                onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Todos los Proyectos</option>
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
                                <option value="">Todos los Usuarios</option>
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
                                Limpiar Filtros
                            </button>
                        </div>
                    )}
                </div>

                {/* Formulario Modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {selectedTask ? 'Editar Tarea' : 'Nueva Tarea'}
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
                                        Título *
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Estado
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                            className="input-field"
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="En Progreso">En Progreso</option>
                                            <option value="Completada">Completada</option>
                                            <option value="Bloqueada">Bloqueada</option>
                                            <option value="Cancelada">Cancelada</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Prioridad
                                        </label>
                                        <select
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                            className="input-field"
                                        >
                                            <option value="Baja">Baja</option>
                                            <option value="Media">Media</option>
                                            <option value="Alta">Alta</option>
                                            <option value="Crítica">Crítica</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Proyecto *
                                    </label>
                                    <select
                                        value={formData.projectId}
                                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Seleccionar proyecto</option>
                                        {projects.map((project) => (
                                            <option key={project._id} value={project._id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Asignado a
                                    </label>
                                    <select
                                        value={formData.assignedTo}
                                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="">Sin asignar</option>
                                        {users.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha de Vencimiento
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Horas Estimadas
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
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        {selectedTask ? 'Actualizar' : 'Crear'} Tarea
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
                        <p className="text-gray-600 text-lg">No hay tareas creadas</p>
                        <p className="text-gray-500 text-sm mt-2">Crea tu primera tarea haciendo clic en "Nueva Tarea"</p>
                    </div>
                ) : (
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tarea
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Prioridad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Proyecto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Asignado a
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vencimiento
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tasks.map((task) => (
                                        <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                                    {task.description && (
                                                        <div className="text-sm text-gray-500 truncate max-w-md">
                                                            {task.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {task.projectId?.name || 'Sin proyecto'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600 mr-2">
                                                        {(task.assignedTo?.username || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    {task.assignedTo?.username || 'Sin asignar'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => setHistoryTaskId(task._id)}
                                                    className="text-purple-600 hover:text-purple-900 mr-3"
                                                    title="Ver historial"
                                                >
                                                    📜 Historial
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(task)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(task._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Eliminar
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
