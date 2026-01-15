'use client';

import { useState } from 'react';
import { OrchestratorService } from '../services/orchestrator.service';

export default function SimpleOrchestratorTest() {
    const [testMessage, setTestMessage] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTest = async () => {
        if (!testMessage.trim()) return;

        setIsTesting(true);
        setTestResult(null);
        setError(null);

        try {
            const result = await OrchestratorService.testOrchestrator(testMessage, 'whatsapp');

            setTestResult({
                success: true,
                response: result.data?.responseData || 'Respuesta del orquestador',
                intent: 'test',
                sentiment: 'positive',
                processingTime: 1500,
                executionId: undefined
            });
        } catch (err) {
            console.error('Error testing orchestrator:', err);
            setError('Error al procesar mensaje');
            setTestResult({
                success: false,
                error: 'Error al procesar mensaje'
            });
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🧠 Prueba del Orquestador Inteligente
                </h3>
                <p className="text-sm text-gray-600">
                    Prueba el sistema de IA con un mensaje real
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensaje de Prueba
                    </label>
                    <textarea
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        placeholder="Escribe un mensaje para probar el orquestador..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                    />
                </div>

                <button
                    onClick={handleTest}
                    disabled={isTesting || !testMessage.trim()}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isTesting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Procesando...
                        </>
                    ) : (
                        <>
                            📤 Probar Orquestador
                        </>
                    )}
                </button>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {testResult && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">Resultado:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${testResult.success
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {testResult.success ? '✅ Éxito' : '❌ Error'}
                            </span>
                        </div>

                        {testResult.success ? (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <strong>Respuesta:</strong> {testResult.response}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                        Intención: {testResult.intent}
                                    </span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                        Sentimiento: {testResult.sentiment}
                                    </span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                        Tiempo: {testResult.processingTime}ms
                                    </span>
                                    {testResult.executionId && (
                                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                                            ID: {testResult.executionId}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-red-600">
                                {testResult.error}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 