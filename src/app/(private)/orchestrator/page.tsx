'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/(public)/auth/hooks/useAuth';
import { OrchestratorService, OrchestratorStatus } from './services/orchestrator.service';

export default function OrchestratorPage() {
    const { user } = useAuth();
    const [orchestratorStatus, setOrchestratorStatus] = useState<OrchestratorStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [activating, setActivating] = useState(false);
    const [testing, setTesting] = useState(false);
    const [message, setMessage] = useState('');
    const [testResult, setTestResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        loadOrchestratorStatus();
    }, []);

    const loadOrchestratorStatus = async () => {
        try {
            setLoading(true);
            const response = await OrchestratorService.getOrchestratorStatus();
            setOrchestratorStatus(response);
            setError(null);
        } catch (err) {
            console.error('Error loading orchestrator status:', err);
            setError('Error al cargar el estado del orquestador');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrchestrator = async () => {
        try {
            setCreating(true);
            setError(null);
            setSuccess(null);

            const response = await OrchestratorService.createOrchestrator();

            setSuccess('✅ Orquestador creado exitosamente');
            await loadOrchestratorStatus();

        } catch (err) {
            console.error('Error creating orchestrator:', err);
            setError('Error al crear el orquestador');
        } finally {
            setCreating(false);
        }
    };

    const handleActivateOrchestrator = async () => {
        if (!orchestratorStatus?.workflowId) return;

        try {
            setActivating(true);
            setError(null);
            setSuccess(null);

            await OrchestratorService.toggleOrchestrator(orchestratorStatus.workflowId, true);
            setSuccess('✅ Orquestador activado exitosamente');
            await loadOrchestratorStatus();

        } catch (err) {
            console.error('Error activating orchestrator:', err);
            setError('Error al activar el orquestador');
        } finally {
            setActivating(false);
        }
    };

    const handleDeactivateOrchestrator = async () => {
        if (!orchestratorStatus?.workflowId) return;

        try {
            setActivating(true);
            setError(null);
            setSuccess(null);

            await OrchestratorService.toggleOrchestrator(orchestratorStatus.workflowId, false);
            setSuccess('⏸️ Orquestador desactivado exitosamente');
            await loadOrchestratorStatus();

        } catch (err) {
            console.error('Error deactivating orchestrator:', err);
            setError('Error al desactivar el orquestador');
        } finally {
            setActivating(false);
        }
    };

    const handleTest = async () => {
        if (!message.trim()) {
            setError('Por favor ingresa un mensaje para probar');
            return;
        }

        try {
            setTesting(true);
            setError(null);
            setSuccess(null);

            const response = await OrchestratorService.testOrchestrator(message);
            setTestResult(response.data);
            setSuccess('✅ Prueba ejecutada exitosamente');

        } catch (err) {
            console.error('Error testing orchestrator:', err);
            setError('Error al probar el orquestador');
        } finally {
            setTesting(false);
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
        setTestResult(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🧠 Orquestador Inteligente
                    </h1>
                    <p className="text-gray-600">
                        Gestiona tu orquestador de IA para procesar mensajes automáticamente
                    </p>
                </div>

                {/* Status Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Estado del Orquestador</h2>
                        <button
                            onClick={loadOrchestratorStatus}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            🔄 Actualizar
                        </button>
                    </div>

                    {orchestratorStatus ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${orchestratorStatus.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {orchestratorStatus.isActive ? '🟢 Activo' : '🔴 Inactivo'}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Estado</p>
                            </div>

                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                    {orchestratorStatus.totalConversations}
                                </div>
                                <p className="text-sm text-gray-600">Conversaciones</p>
                            </div>

                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                    {orchestratorStatus.averageResponseTime}ms
                                </div>
                                <p className="text-sm text-gray-600">Tiempo Promedio</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-400 mb-2">📭</div>
                            <p className="text-gray-600">No hay orquestador configurado</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones</h2>

                    <div className="space-y-4">
                        {!orchestratorStatus ? (
                            <button
                                onClick={handleCreateOrchestrator}
                                disabled={creating}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                            >
                                {creating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Creando...
                                    </>
                                ) : (
                                    <>
                                        🚀 Crear Orquestador Inteligente
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={orchestratorStatus.isActive ? handleDeactivateOrchestrator : handleActivateOrchestrator}
                                    disabled={activating}
                                    className={`font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center ${orchestratorStatus.isActive
                                        ? 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white'
                                        : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white'
                                        }`}
                                >
                                    {activating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            {orchestratorStatus.isActive ? 'Desactivando...' : 'Activando...'}
                                        </>
                                    ) : (
                                        <>
                                            {orchestratorStatus.isActive ? '⏸️ Desactivar' : '✅ Activar'}
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={loadOrchestratorStatus}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    🔄 Actualizar Estado
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Test Section */}
                {orchestratorStatus && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pruebas del Sistema</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mensaje de Prueba
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Escribe un mensaje para probar el orquestador..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    rows={3}
                                />
                            </div>

                            <button
                                onClick={handleTest}
                                disabled={testing || !message.trim() || !orchestratorStatus.isActive}
                                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                            >
                                {testing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Probando...
                                    </>
                                ) : (
                                    <>
                                        🧪 Probar Orquestador
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Messages */}
                {(error || success) && (
                    <div className="mb-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center">
                                    <div className="text-red-400 mr-2">⚠️</div>
                                    <p className="text-red-800">{error}</p>
                                    <button
                                        onClick={clearMessages}
                                        className="ml-auto text-red-600 hover:text-red-800"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center">
                                    <div className="text-green-400 mr-2">✅</div>
                                    <p className="text-green-800">{success}</p>
                                    <button
                                        onClick={clearMessages}
                                        className="ml-auto text-green-600 hover:text-green-800"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Test Results */}
                {testResult && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resultado de la Prueba</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">📤 Datos Enviados</h3>
                                    <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                                        {JSON.stringify(testResult.requestData, null, 2)}
                                    </pre>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">📥 Respuesta</h3>
                                    <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                                        {JSON.stringify(testResult.responseData, null, 2)}
                                    </pre>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="text-blue-400 mr-2">ℹ️</div>
                                    <div>
                                        <p className="text-blue-800 font-medium">Método de Ejecución</p>
                                        <p className="text-blue-700 text-sm">{testResult.executionMethod}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 