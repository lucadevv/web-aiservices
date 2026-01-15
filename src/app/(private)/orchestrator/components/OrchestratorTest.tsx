'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, MessageSquare } from 'lucide-react';

export default function OrchestratorTest() {
    const [testMessage, setTestMessage] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<any>(null);

    const handleTest = async () => {
        if (!testMessage.trim()) return;

        setIsTesting(true);
        setTestResult(null);

        try {
            // Simular llamada al orquestador
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simular respuesta
            setTestResult({
                success: true,
                response: `Respuesta simulada del orquestador: "${testMessage}"`,
                intent: 'test',
                sentiment: 'positive',
                processingTime: 1500
            });
        } catch (error) {
            setTestResult({
                success: false,
                error: 'Error al procesar mensaje'
            });
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    Prueba del Orquestador
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

                <Button
                    onClick={handleTest}
                    disabled={isTesting || !testMessage.trim()}
                    className="w-full"
                >
                    {isTesting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Procesando...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4 mr-2" />
                            Probar Orquestador
                        </>
                    )}
                </Button>

                {testResult && (
                    <div className="mt-4 p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4" />
                            <span className="font-medium">Resultado:</span>
                            <Badge variant={testResult.success ? "default" : "destructive"}>
                                {testResult.success ? 'Éxito' : 'Error'}
                            </Badge>
                        </div>

                        {testResult.success ? (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <strong>Respuesta:</strong> {testResult.response}
                                </p>
                                <div className="flex gap-2">
                                    <Badge variant="outline">
                                        Intención: {testResult.intent}
                                    </Badge>
                                    <Badge variant="outline">
                                        Sentimiento: {testResult.sentiment}
                                    </Badge>
                                    <Badge variant="outline">
                                        Tiempo: {testResult.processingTime}ms
                                    </Badge>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-red-600">
                                {testResult.error}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 