// ===============================================
// CEO AI HOOK - FRONTEND
// ===============================================

import { useState, useEffect, useCallback } from 'react';
import { ceoAIService } from '../services/ceo-ai.service';
import type {
    CEOAI,
    Agent,
    CreateAgentData,
    CreateAgentResponse
} from '../models/ceo-ai.model';

export const useCEOAI = (ceoAIId: string) => {
    const [ceoAI, setCeoAI] = useState<CEOAI | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingAgents, setIsLoadingAgents] = useState(false);
    const [isCreatingAgent, setIsCreatingAgent] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load CEO AI with workflow status
    const loadCEOAI = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const ceoAIWithStatus = await ceoAIService.getCEOAIWithWorkflowStatus(ceoAIId);
            setCeoAI(ceoAIWithStatus);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading CEO AI');
            setCeoAI(null);
        } finally {
            setIsLoading(false);
        }
    }, [ceoAIId]);

    // Load agents
    const loadAgents = useCallback(async () => {
        try {
            setIsLoadingAgents(true);
            setError(null);

            const agentsList = await ceoAIService.getCEOAIAgents(ceoAIId);
            setAgents(agentsList);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading agents');
            setAgents([]);
        } finally {
            setIsLoadingAgents(false);
        }
    }, [ceoAIId]);

    // Update CEO AI
    const updateCEOAI = useCallback(async (data: Partial<CEOAI>): Promise<CEOAI> => {
        try {
            setIsUpdating(true);
            setError(null);

            const updatedCEOAI = await ceoAIService.updateCEOAI(ceoAIId, data);
            setCeoAI(updatedCEOAI);
            return updatedCEOAI;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating CEO AI');
            throw err;
        } finally {
            setIsUpdating(false);
        }
    }, [ceoAIId]);

    // Update CEO AI status
    const updateCEOAIStatus = useCallback(async (status: 'active' | 'inactive'): Promise<CEOAI> => {
        try {
            setIsUpdating(true);
            setError(null);

            const updatedCEOAI = await ceoAIService.updateCEOAIStatus(ceoAIId, status);
            setCeoAI(updatedCEOAI);
            return updatedCEOAI;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating CEO AI status');
            throw err;
        } finally {
            setIsUpdating(false);
        }
    }, [ceoAIId]);

    // Delete CEO AI
    const deleteCEOAI = useCallback(async (): Promise<void> => {
        try {
            setIsDeleting(true);
            setError(null);

            await ceoAIService.deleteCEOAI(ceoAIId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting CEO AI');
            throw err;
        } finally {
            setIsDeleting(false);
        }
    }, [ceoAIId]);

    // Create agent
    const createAgent = useCallback(async (data: CreateAgentData): Promise<CreateAgentResponse> => {
        try {
            setIsCreatingAgent(true);
            setError(null);

            const result = await ceoAIService.addSpecializedAgent(ceoAIId, data);

            // Add new agent to the list
            setAgents(prev => [result.agent, ...prev]);

            // Update CEO AI to refresh agent count
            await loadCEOAI();

            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating agent');
            throw err;
        } finally {
            setIsCreatingAgent(false);
        }
    }, [ceoAIId, loadCEOAI]);

    // Refresh data
    const refresh = useCallback(async () => {
        await Promise.all([loadCEOAI(), loadAgents()]);
    }, [loadCEOAI, loadAgents]);

    // Load data on mount
    useEffect(() => {
        if (ceoAIId) {
            refresh();
        }
    }, [ceoAIId, refresh]);

    return {
        // State
        ceoAI,
        agents,
        isLoading,
        isLoadingAgents,
        isCreatingAgent,
        isUpdating,
        isDeleting,
        error,

        // Actions
        loadCEOAI,
        loadAgents,
        updateCEOAI,
        updateCEOAIStatus,
        deleteCEOAI,
        createAgent,
        refresh
    };
}; 