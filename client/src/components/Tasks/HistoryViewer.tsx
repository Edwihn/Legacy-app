import React, { useEffect, useState } from 'react';
import { historyService, HistoryEntry } from '../../services/historyService';
import toast from 'react-hot-toast';

interface HistoryViewerProps {
    taskId: string;
    onClose: () => void;
}

const HistoryViewer: React.FC<HistoryViewerProps> = ({ taskId, onClose }) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, [taskId]);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const data = await historyService.getTaskHistory(taskId);
            setHistory(data);
        } catch (error: any) {
            toast.error('Error loading history');
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action: string) => {
        const icons: Record<string, string> = {
            CREATED: '🆕',
            UPDATED: '✏️',
            STATUS_CHANGED: '🔄',
            ASSIGNED: '👤',
            COMPLETED: '✅',
            DELETED: '🗑️',
        };
        return icons[action] || '📝';
    };

    const getActionText = (action: string) => {
        const texts: Record<string, string> = {
            CREATED: 'Task created',
            UPDATED: 'Task updated',
            STATUS_CHANGED: 'Status changed',
            ASSIGNED: 'Task assigned',
            COMPLETED: 'Task completed',
            DELETED: 'Task deleted',
        };
        return texts[action] || action;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatChanges = (changes: Record<string, any>) => {
        if (!changes || Object.keys(changes).length === 0) return null;

        return (
            <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                {Object.entries(changes).map(([key, value]) => (
                    <div key={key} className="mb-1">
                        <span className="font-medium">{key}:</span>{' '}
                        <span className="text-gray-700">
                            {value?.from && value?.to ? (
                                <>
                                    <span className="line-through text-red-600">{value.from}</span>
                                    {' → '}
                                    <span className="text-green-600">{value.to}</span>
                                </>
                            ) : (
                                JSON.stringify(value)
                            )}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-2xl w-full max-h-[80vh] overflow-hidden p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        📜 Change History
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-2">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-600">No history available</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((entry) => (
                                <div
                                    key={entry._id}
                                    className="relative pl-8 pb-4 border-l-2 border-gray-200 last:border-l-0"
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl">{getActionIcon(entry.action)}</span>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {getActionText(entry.action)}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        by <span className="font-medium">{entry.userId?.username || 'Unknown user'}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(entry.createdAt)}
                                            </span>
                                        </div>

                                        {entry.changes && Object.keys(entry.changes).length > 0 && (
                                            <div className="mt-3">
                                                {formatChanges(entry.changes)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <button onClick={onClose} className="btn-secondary w-full">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HistoryViewer;
