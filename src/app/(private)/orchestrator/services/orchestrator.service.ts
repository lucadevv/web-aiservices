import { apiService } from '../../../../shared/services/api.service';

export interface OrchestratorStatus {
    isActive: boolean;
    workflowId?: string;
    webhookUrl?: string;
    lastActivity?: string;
    totalConversations?: number;
    averageResponseTime?: number;
}

export interface ConversationAnalytics {
    total: number;
    byIntent: Record<string, number>;
    bySentiment: Record<string, number>;
    byChannel: Record<string, number>;
    averageResponseTime: number;
}

export interface CreateOrchestratorResponse {
    success: boolean;
    message: string;
    data: {
        workflow: {
            id: string;
            name: string;
            active: boolean;
        };
        webhookUrls: string[];
        setupInstructions: string[];
    };
}

export interface TestOrchestratorResponse {
    success: boolean;
    message: string;
    data: {
        webhookUrl: string;
        requestData: any;
        responseData: any;
        executionMethod: string;
        note?: string;
    };
}

export class OrchestratorService {
    /**
     * Crear orquestador inteligente
     */
    static async createOrchestrator(): Promise<CreateOrchestratorResponse> {
        try {
            const response = await apiService.post<CreateOrchestratorResponse>('/orchestrator/create', {});
            return response.data as CreateOrchestratorResponse;
        } catch (error) {
            console.error('Error creating orchestrator:', error);
            throw new Error('Failed to create orchestrator');
        }
    }

    /**
     * Obtener estado del orquestador
     */
    static async getOrchestratorStatus(): Promise<OrchestratorStatus> {
        try {
            console.log('OrchestratorService: Calling apiService.get for /orchestrator/status');
            const response = await apiService.get<OrchestratorStatus>('/orchestrator/status');
            console.log('OrchestratorService: apiService.get response:', response);
            console.log('OrchestratorService: response type:', typeof response);
            console.log('OrchestratorService: response keys:', Object.keys(response || {}));
            console.log('OrchestratorService: response.data:', response.data);
            console.log('OrchestratorService: response.success:', response.success);
            console.log('OrchestratorService: response.message:', response.message);

            // Si response.data es undefined, intentar usar response directamente
            if (!response.data) {
                console.log('OrchestratorService: response.data is undefined, trying response directly');
                // Verificar si response tiene las propiedades de OrchestratorStatus
                if (response && typeof response === 'object' && 'isActive' in response) {
                    console.log('OrchestratorService: Using response directly as OrchestratorStatus');
                    return response as OrchestratorStatus;
                }

                console.error('OrchestratorService: response.data is undefined or null');
                return {
                    isActive: false,
                    totalConversations: 0,
                    averageResponseTime: 0
                };
            }

            const result = response.data as OrchestratorStatus;
            console.log('OrchestratorService: Returning result:', result);
            return result;
        } catch (error) {
            console.error('Error getting orchestrator status:', error);
            return {
                isActive: false,
                totalConversations: 0,
                averageResponseTime: 0
            };
        }
    }

    /**
     * Activar/desactivar orquestador
     */
    static async toggleOrchestrator(workflowId: string, active: boolean): Promise<void> {
        try {
            const action = active ? 'activate' : 'deactivate';
            await apiService.post(`/orchestrator/${action}`, { workflowId });
        } catch (error) {
            console.error('Error toggling orchestrator:', error);
            throw new Error('Failed to toggle orchestrator');
        }
    }

    /**
     * Obtener analytics del orquestador
     */
    static async getAnalytics(): Promise<ConversationAnalytics> {
        try {
            const response = await apiService.get('/analytics/orchestrator');
            return response.data as ConversationAnalytics;
        } catch (error) {
            console.error('Error getting analytics:', error);
            return {
                total: 0,
                byIntent: {},
                bySentiment: {},
                byChannel: {},
                averageResponseTime: 0
            };
        }
    }

    /**
     * Probar el orquestador con un mensaje
     */
    static async testOrchestrator(message: string, channel: string = 'whatsapp'): Promise<TestOrchestratorResponse> {
        try {
            console.log('OrchestratorService: Calling testOrchestrator with:', { message, channel });
            const response = await apiService.post('/orchestrator/test', {
                message,
                channel,
                timestamp: new Date().toISOString()
            });
            console.log('OrchestratorService: testOrchestrator response:', response);
            console.log('OrchestratorService: response.success:', response.success);
            console.log('OrchestratorService: response.data:', response.data);
            return response as TestOrchestratorResponse;
        } catch (error) {
            console.error('Error testing orchestrator:', error);
            throw new Error('Failed to test orchestrator');
        }
    }

    /**
     * Obtener logs del orquestador
     */
    static async getOrchestratorLogs(limit: number = 50): Promise<any[]> {
        try {
            const response = await apiService.get(`/orchestrator/logs?limit=${limit}`);
            return response.data as any[];
        } catch (error) {
            console.error('Error getting orchestrator logs:', error);
            return [];
        }
    }
} 