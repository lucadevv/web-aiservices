'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../(public)/auth/hooks/useAuth';
import { useCEOAI } from '../shared/hooks/useCEOAI';
import CreateCEOAIModal from '../shared/components/CreateCEOAIModal';
import { PlusIcon, UserGroupIcon, ChatBubbleLeftRightIcon, CpuChipIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
    const { user } = useAuth();
    const { ceoAIs, isLoading: loading, createCEOAI, isCreating } = useCEOAI();
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Calcular estadísticas REALES sin mocks
    const totalCEOAIs = ceoAIs.length;
    const activeCEOAIs = ceoAIs.filter(ceoAI => ceoAI.status === 'active').length;

    // TODO: Implementar carga de agentes y conversaciones reales
    // Por ahora mostrar 0 hasta que implementemos las APIs correspondientes
    const totalAgents = 0;
    const totalConversations = 0;

    const stats = [
        {
            name: 'CEO AIs Activos',
            value: activeCEOAIs,
            icon: CpuChipIcon,
            color: 'bg-blue-500'
        },
        {
            name: 'Agentes Totales',
            value: totalAgents,
            icon: UserGroupIcon,
            color: 'bg-green-500'
        },
        {
            name: 'Conversaciones',
            value: totalConversations,
            icon: ChatBubbleLeftRightIcon,
            color: 'bg-purple-500'
        }
    ];

    const handleCreateCEOAI = async (data: any) => {
        try {
            await createCEOAI(data);
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating CEO AI:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    ¡Hola, {user?.first_name || 'Usuario'}! 👋
                </h1>
                <p className="text-gray-600 mt-2">
                    Bienvenido a tu panel de control de CEO AI Platform
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CEO AIs Section */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Mis CEO AIs</h2>
                        {totalCEOAIs > 0 && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Crear CEO AI
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {totalCEOAIs === 0 ? (
                        <div className="text-center py-12">
                            <CpuChipIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes CEO AIs</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Comienza creando tu primer CEO AI para automatizar tu empresa.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    Crear mi primer CEO AI
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ceoAIs.map((ceoAI) => (
                                <div key={ceoAI.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{ceoAI.name}</h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${ceoAI.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {ceoAI.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-2">{ceoAI.company_name}</p>
                                    {ceoAI.industry && (
                                        <p className="text-xs text-gray-500 mb-4">Industria: {ceoAI.industry}</p>
                                    )}

                                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                                        <span>0 agentes</span>
                                        <span>0 conversaciones</span>
                                    </div>

                                    <div className="flex space-x-2">
                                        <a
                                            href={`/ceo-ai/${ceoAI.id}`}
                                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors text-center"
                                        >
                                            Ver detalles
                                        </a>
                                        <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                                            Configurar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button for creating CEO AI when there are existing ones */}
            {totalCEOAIs > 0 && (
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="Crear nuevo CEO AI"
                >
                    <PlusIcon className="h-6 w-6" />
                </button>
            )}

            {/* Create CEO AI Modal */}
            <CreateCEOAIModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateCEOAI}
                isLoading={isCreating}
            />
        </div>
    );
} 