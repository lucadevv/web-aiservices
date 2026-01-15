'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/(public)/auth/hooks/useAuth';
import { useCEOAI } from './hooks/useCEOAI';
import AddAgentModal from './components/AddAgentModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import FloatingChatButton from './components/FloatingChatButton';
import ChatModal from './components/ChatModal';
import {
    BuildingOfficeIcon,
    UserGroupIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    PlusIcon,
    ArrowLeftIcon,
    ChartBarIcon,
    GlobeAltIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    TrashIcon,
    PlayIcon,
    PauseIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import type { CreateAgentData } from './models/ceo-ai.model';

export default function CEOAIPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const ceoAIId = params.id as string;

    const {
        ceoAI,
        agents,
        isLoading,
        isLoadingAgents,
        isCreatingAgent,
        isUpdating,
        isDeleting,
        error,
        updateCEOAIStatus,
        deleteCEOAI,
        createAgent
    } = useCEOAI(ceoAIId);

    const [activeTab, setActiveTab] = useState('overview');
    const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatMinimized, setIsChatMinimized] = useState(false);

    const handleAddAgent = () => {
        setIsAgentModalOpen(true);
    };

    const handleCloseAgentModal = () => {
        setIsAgentModalOpen(false);
    };

    const handleSubmitAgent = async (data: CreateAgentData) => {
        try {
            await createAgent(data);
            setIsAgentModalOpen(false);
        } catch (error) {
            console.error('Error creating agent:', error);
            // Keep modal open on error so user can fix and retry
        }
    };

    const handleDeleteCEOAI = async () => {
        try {
            await deleteCEOAI();
            router.push('/dashboard');
        } catch (error) {
            console.error('Error deleting CEO AI:', error);
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!ceoAI) return;

        try {
            const newStatus = ceoAI.status === 'active' ? 'inactive' : 'active';
            await updateCEOAIStatus(newStatus);
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando CEO AI...</p>
                </div>
            </div>
        );
    }

    if (!ceoAI) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
                    <h2 className="mt-4 text-lg font-semibold text-gray-900">CEO AI no encontrado</h2>
                    <p className="mt-2 text-gray-600">El CEO AI que buscas no existe o no tienes permisos para acceder.</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', name: 'Resumen', icon: ChartBarIcon },
        { id: 'agents', name: 'Agentes', icon: UserGroupIcon },
        { id: 'conversations', name: 'Conversaciones', icon: ChatBubbleLeftRightIcon },
        { id: 'settings', name: 'Configuración', icon: Cog6ToothIcon },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{ceoAI.name}</h1>
                            <p className="text-gray-600">{ceoAI.company_name}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {/* Estado real del workflow n8n */}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${(ceoAI.n8n_status || ceoAI.status) === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {(ceoAI.n8n_status || ceoAI.status) === 'active' ? 'Activo' : 'Inactivo'}
                            {ceoAI.n8n_status && ceoAI.n8n_status !== ceoAI.status && (
                                <span className="ml-1 text-xs text-orange-600">(n8n)</span>
                            )}
                        </span>

                        <button
                            onClick={handleToggleStatus}
                            disabled={isUpdating}
                            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${(ceoAI.n8n_status || ceoAI.status) === 'active'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                        >
                            {isUpdating ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                            ) : (ceoAI.n8n_status || ceoAI.status) === 'active' ? (
                                <PauseIcon className="w-4 h-4 mr-1" />
                            ) : (
                                <PlayIcon className="w-4 h-4 mr-1" />
                            )}
                            {(ceoAI.n8n_status || ceoAI.status) === 'active' ? 'Desactivar' : 'Activar'}
                        </button>

                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar CEO AI"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && <OverviewTab ceoAI={ceoAI} />}
                    {activeTab === 'agents' && <AgentsTab ceoAI={ceoAI} onAddAgent={handleAddAgent} agents={agents} isLoadingAgents={isLoadingAgents} />}
                    {activeTab === 'conversations' && <ConversationsTab ceoAI={ceoAI} />}
                    {activeTab === 'settings' && <SettingsTab ceoAI={ceoAI} />}
                </div>
            </div>

            {/* Modals */}
            <AddAgentModal
                isOpen={isAgentModalOpen}
                onClose={handleCloseAgentModal}
                onSubmit={handleSubmitAgent}
                isLoading={isCreatingAgent}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteCEOAI}
                title="Eliminar CEO AI"
                message={`¿Estás seguro de que quieres eliminar "${ceoAI.name}"? Esta acción no se puede deshacer.`}
                isLoading={isDeleting}
            />

            {/* Chat Components */}
            <FloatingChatButton
                onClick={() => setIsChatOpen(true)}
                isActive={isChatOpen}
                isVisible={!isChatOpen && !isChatMinimized}
            />

            <ChatModal
                isOpen={isChatOpen}
                onClose={() => {
                    setIsChatOpen(false);
                    setIsChatMinimized(false); // Resetear estado minimizado al cerrar
                }}
                ceoAIId={ceoAI.id}
                ceoAIName={ceoAI.name}
                onMinimizeChange={setIsChatMinimized}
            />

        </div>
    );
}

// Tab Components
function OverviewTab({ ceoAI }: { ceoAI: any }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <UserGroupIcon className="w-8 h-8 text-blue-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-blue-600">Agentes</p>
                            <p className="text-2xl font-bold text-blue-900">{ceoAI.specialized_agents?.length || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-600">Conversaciones</p>
                            <p className="text-2xl font-bold text-green-900">{ceoAI.usage_stats?.total_conversations || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <GlobeAltIcon className="w-8 h-8 text-purple-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-purple-600">Industria</p>
                            <p className="text-lg font-semibold text-purple-900">{ceoAI.industry || 'No especificada'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del CEO AI</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Descripción</p>
                        <p className="text-gray-900">{ceoAI.description || 'Sin descripción'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Personalidad</p>
                        <p className="text-gray-900">{ceoAI.personality || 'No especificada'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Creado</p>
                        <p className="text-gray-900">{new Date(ceoAI.created_at).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Última actividad</p>
                        <p className="text-gray-900">{new Date(ceoAI.last_active).toLocaleDateString('es-ES')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AgentsTab({ ceoAI, onAddAgent, agents, isLoadingAgents }: { ceoAI: any; onAddAgent: () => void; agents: any[]; isLoadingAgents: boolean }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Agentes Especializados</h3>
                <button
                    onClick={onAddAgent}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Agregar Agente
                </button>
            </div>

            {isLoadingAgents ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Cargando agentes...</p>
                </div>
            ) : agents.length === 0 ? (
                <div className="text-center py-8">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay agentes</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Comienza agregando agentes especializados para tu CEO AI.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={onAddAgent}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Agregar Primer Agente
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent) => (
                        <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {agent.status === 'active' ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
                            <div className="text-xs text-gray-500 space-y-1">
                                <p><strong>Tipo:</strong> {agent.type}</p>
                                <p><strong>Especialización:</strong> {agent.specialization}</p>
                                <p><strong>Conversaciones:</strong> {agent.conversations}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ConversationsTab({ ceoAI }: { ceoAI: any }) {
    return (
        <div className="text-center py-8">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Conversaciones</h3>
            <p className="mt-1 text-sm text-gray-500">
                Las conversaciones aparecerán aquí cuando el CEO AI esté activo.
            </p>
        </div>
    );
}

function SettingsTab({ ceoAI }: { ceoAI: any }) {
    return (
        <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                    <InformationCircleIcon className="w-5 h-5 text-yellow-400 mr-2" />
                    <p className="text-yellow-800">
                        La configuración avanzada estará disponible próximamente.
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">ID del CEO AI</p>
                        <p className="text-gray-900 font-mono text-sm">{ceoAI.id}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Workflow ID</p>
                        <p className="text-gray-900 font-mono text-sm">{ceoAI.n8n_workflow_id || 'No asignado'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Usuario</p>
                        <p className="text-gray-900">{ceoAI.user_id}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Estado del Workflow</p>
                        <p className="text-gray-900">{ceoAI.n8n_status || ceoAI.status}</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 