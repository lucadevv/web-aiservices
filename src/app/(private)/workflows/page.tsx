'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWorkflows } from './hooks/useWorkflows';

export default function WorkflowsPage() {
    const { workflows, isLoading, error, fetchWorkflows, toggleWorkflow, deleteWorkflow } = useWorkflows();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

    useEffect(() => {
        fetchWorkflows();
    }, [fetchWorkflows]);

    const filteredWorkflows = workflows.filter(workflow => {
        const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            workflow.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'active' && workflow.is_active) ||
            (filterStatus === 'inactive' && !workflow.is_active);

        return matchesSearch && matchesStatus;
    });

    const handleToggleWorkflow = async (id: string, isActive: boolean) => {
        try {
            await toggleWorkflow(id, isActive);
        } catch (error) {
            console.error('Error toggling workflow:', error);
        }
    };

    const handleDeleteWorkflow = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este workflow? Esta acción no se puede deshacer.')) {
            try {
                await deleteWorkflow(id);
            } catch (error) {
                console.error('Error deleting workflow:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando workflows...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
                    <p className="text-gray-600 mt-1">
                        Gestiona tus flujos de automatización
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href="/dashboard/workflows/new"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Crear Workflow
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="search" className="sr-only">Buscar workflows</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Buscar workflows..."
                            />
                        </div>
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="active">Solo activos</option>
                            <option value="inactive">Solo inactivos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Workflows List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {error && (
                    <div className="p-6 border-b border-gray-200">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    </div>
                )}

                {filteredWorkflows.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay workflows</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || filterStatus !== 'all'
                                ? 'No se encontraron workflows con los filtros aplicados.'
                                : 'Comienza creando tu primer workflow de automatización.'
                            }
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/dashboard/workflows/new"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Crear Workflow
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredWorkflows.map((workflow) => (
                            <div key={workflow.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-lg font-medium text-gray-900 truncate">
                                                {workflow.name}
                                            </h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${workflow.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {workflow.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        {workflow.description && (
                                            <p className="mt-1 text-sm text-gray-500 truncate">
                                                {workflow.description}
                                            </p>
                                        )}
                                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                            <span>{workflow.executions_count} ejecuciones</span>
                                            <span>•</span>
                                            <span>Creado {new Date(workflow.created_at).toLocaleDateString('es-ES')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => handleToggleWorkflow(workflow.id, !workflow.is_active)}
                                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${workflow.is_active
                                                ? 'text-orange-700 bg-orange-100 hover:bg-orange-200'
                                                : 'text-green-700 bg-green-100 hover:bg-green-200'
                                                }`}
                                        >
                                            {workflow.is_active ? 'Desactivar' : 'Activar'}
                                        </button>
                                        <Link
                                            href={`/dashboard/workflows/${workflow.id}`}
                                            className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteWorkflow(workflow.id)}
                                            className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Workflows</p>
                            <p className="text-2xl font-bold text-gray-900">{workflows.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Activos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {workflows.filter(w => w.is_active).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Inactivos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {workflows.filter(w => !w.is_active).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 