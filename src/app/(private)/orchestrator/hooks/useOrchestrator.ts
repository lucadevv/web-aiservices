import { useState, useEffect, useCallback } from 'react';
import { OrchestratorService, OrchestratorStatus, ConversationAnalytics } from '../services/orchestrator.service';

export const useOrchestrator = () => {
    const [orchestratorStatus, setOrchestratorStatus] = useState<OrchestratorStatus>({
        isActive: false,
        workflowId: undefined,
        webhookUrl: undefined,
        lastActivity: undefined,
        totalConversations: 0,
        averageResponseTime: 0
    });
    const [analytics, setAnalytics] = useState<ConversationAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar estado del orquestador
    const loadOrchestratorStatus = useCallback(async () => {
        try {
            setError(null);
            const status = await OrchestratorService.getOrchestratorStatus();
            setOrchestratorStatus(status);
        } catch (err) {
            setError('Error loading orchestrator status');
            console.error('Error loading orchestrator status:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Cargar analytics
    const loadAnalytics = useCallback(async () => {
        try {
            const analyticsData = await OrchestratorService.getAnalytics();
            setAnalytics(analyticsData);
        } catch (err) {
            console.error('Error loading analytics:', err);
        }
    }, []);

    // Crear orquestador
    const createOrchestrator = useCallback(async () => {
        try {
            setIsCreating(true);
            setError(null);

            const result = await OrchestratorService.createOrchestrator();
            console.log('Orchestrator created successfully:', result);

            // Recargar estado después de crear
            await loadOrchestratorStatus();

            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create orchestrator';
            setError(errorMessage);
            throw err;
        } finally {
            setIsCreating(false);
        }
    }, [loadOrchestratorStatus]);

    // Activar/desactivar orquestador
    const toggleOrchestrator = useCallback(async () => {
        if (!orchestratorStatus.workflowId) {
            setError('No orchestrator workflow found');
            return;
        }

        try {
            setError(null);
            const newActiveState = !orchestratorStatus.isActive;

            await OrchestratorService.toggleOrchestrator(
                orchestratorStatus.workflowId,
                newActiveState
            );

            // Actualizar estado local
            setOrchestratorStatus(prev => ({
                ...prev,
                isActive: newActiveState
            }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to toggle orchestrator';
            setError(errorMessage);
        }
    }, [orchestratorStatus.workflowId, orchestratorStatus.isActive]);

    // Probar orquestador
    const testOrchestrator = useCallback(async (message: string, channel: string = 'whatsapp') => {
        try {
            setError(null);
            const result = await OrchestratorService.testOrchestrator(message, channel);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to test orchestrator';
            setError(errorMessage);
            throw err;
        }
    }, []);

    // Cargar datos iniciales
    useEffect(() => {
        loadOrchestratorStatus();
        loadAnalytics();
    }, [loadOrchestratorStatus, loadAnalytics]);

    // Auto-refresh cada 30 segundos si está activo
    useEffect(() => {
        if (!orchestratorStatus.isActive) return;

        const interval = setInterval(() => {
            loadOrchestratorStatus();
            loadAnalytics();
        }, 30000);

        return () => clearInterval(interval);
    }, [orchestratorStatus.isActive, loadOrchestratorStatus, loadAnalytics]);

    return {
        // Estado
        orchestratorStatus,
        analytics,
        isLoading,
        isCreating,
        error,

        // Acciones
        createOrchestrator,
        toggleOrchestrator,
        testOrchestrator,
        loadOrchestratorStatus,
        loadAnalytics,

        // Utilidades
        clearError: () => setError(null)
    };
}; 