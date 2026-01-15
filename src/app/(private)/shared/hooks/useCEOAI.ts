// ===============================================
// CEO AI HOOK - FRONTEND
// ===============================================

import { useState, useEffect, useCallback } from 'react';
import { ceoAIService, type CEOAI } from '../services/ceo-ai.service';
import type { CreateCEOAIData } from '../components/CreateCEOAIModal';



export interface CreateCEOAIRequest {
    name: string;
    company_name: string;
    industry: string;
    description: string;
    personality: string;
}

export interface CreateCEOAIResponse {
    ceo_ai: CEOAI;
    usage_remaining: {
        ceo_ais_left: number;
        agents_left: number;
        conversations_left: number;
    };
}

export interface Agent {
    id: string;
    ceo_ai_id: string;
    name: string;
    type: string;
    description: string;
    specialization: string;
    personality: string;
    status: 'active' | 'inactive';
    conversations: number;
    lastActive: string;
    created_at: string;
    n8n_workflow_id?: string;
}

export interface CreateAgentData {
    name: string;
    type: string;
    description: string;
    specialization: string;
    personality: string;
}

export interface CreateAgentResponse {
    agent: Agent;
    usage_remaining: {
        agents_left: number;
    };
}

export const useCEOAI = () => {
    const [ceoAIs, setCeoAIs] = useState<CEOAI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load CEO AIs
    const loadCEOAIs = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Use the CEO AI service
            const ceoAIs = await ceoAIService.getCEOAIList();
            setCeoAIs(ceoAIs);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading CEO AIs');
            setCeoAIs([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create CEO AI
    const createCEOAI = useCallback(async (data: CreateCEOAIData): Promise<CreateCEOAIResponse> => {
        try {
            setIsCreating(true);
            setError(null);

            // Use the CEO AI service
            const result = await ceoAIService.createCEOAI(data);

            // Add to local state
            setCeoAIs(prev => [result.ceo_ai, ...prev]);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating CEO AI');
            throw err;
        } finally {
            setIsCreating(false);
        }
    }, []);

    // Update CEO AI
    const updateCEOAI = useCallback(async (id: string, updates: Partial<CEOAI>): Promise<CEOAI> => {
        try {
            setError(null);

            // Use the CEO AI service
            const updatedCEOAI = await ceoAIService.updateCEOAI(id, updates);

            // Update local state
            setCeoAIs(prev => prev.map(ceoAI =>
                ceoAI.id === id ? updatedCEOAI : ceoAI
            ));

            return updatedCEOAI;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating CEO AI');
            throw err;
        }
    }, []);

    // Delete CEO AI
    const deleteCEOAI = useCallback(async (id: string): Promise<void> => {
        try {
            setError(null);

            // Use the CEO AI service
            await ceoAIService.deleteCEOAI(id);

            // Remove from local state
            setCeoAIs(prev => prev.filter(ceoAI => ceoAI.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting CEO AI');
            throw err;
        }
    }, []);

    // Get CEO AI by ID
    const getCEOAIById = useCallback((id: string): CEOAI | undefined => {
        return ceoAIs.find(ceoAI => ceoAI.id === id);
    }, [ceoAIs]);

    // Update CEO AI Status (Activate/Deactivate)
    const updateCEOAIStatus = useCallback(async (id: string, status: 'active' | 'inactive'): Promise<void> => {
        try {
            setError(null);
            await ceoAIService.updateCEOAI(id, { status });
            setCeoAIs(prev => prev.map(ceoAI =>
                ceoAI.id === id ? { ...ceoAI, status } : ceoAI
            ));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating CEO AI status');
            throw err;
        }
    }, []);

    // Get CEO AI Workflow Info
    const getCEOAIWorkflow = useCallback(async (id: string): Promise<any> => {
        try {
            setError(null);
            // Use the CEO AI service
            const response = await ceoAIService.getCEOAIWorkflow(id);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error getting CEO AI workflow');
            throw err;
        }
    }, []);

    // Get CEO AI with real n8n workflow status
    const getCEOAIWithWorkflowStatus = useCallback(async (id: string): Promise<any> => {
        try {
            setError(null);

            // Obtener CEO AI básico
            const ceoAI = ceoAIs.find(c => c.id === id);
            if (!ceoAI) {
                throw new Error('CEO AI no encontrado');
            }

            // Si tiene workflow n8n, obtener el estado real
            if ((ceoAI as any).n8n_workflow_id) {
                try {
                    const workflowInfo = await getCEOAIWorkflow(id);
                    return {
                        ...ceoAI,
                        n8n_status: workflowInfo.workflow_active ? 'active' : 'inactive',
                        workflow_info: workflowInfo
                    };
                } catch (workflowError) {
                    // Si no se puede obtener el workflow, usar el estado del backend
                    return {
                        ...ceoAI,
                        n8n_status: ceoAI.status,
                        workflow_info: null
                    };
                }
            }

            return {
                ...ceoAI,
                n8n_status: ceoAI.status,
                workflow_info: null
            };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error getting CEO AI with workflow status');
            throw err;
        }
    }, [ceoAIs, getCEOAIWorkflow]);

    // Create Agent
    const createAgent = useCallback(async (ceoAIId: string, data: CreateAgentData): Promise<CreateAgentResponse> => {
        console.log('🎯 useCEOAI.createAgent llamado con:', { ceoAIId, data });

        try {
            setError(null);

            // Use the CEO AI service
            console.log('📤 Llamando al servicio para crear agente');
            const result = await ceoAIService.addSpecializedAgent(ceoAIId, data);

            console.log('📥 Respuesta del servicio:', result);

            console.log('✅ Agente creado exitosamente en useCEOAI');
            return result;
        } catch (err) {
            console.error('❌ Error en useCEOAI.createAgent:', err);
            setError(err instanceof Error ? err.message : 'Error creating agent');
            throw err;
        }
    }, []);

    // Get Agents by CEO AI ID
    const getAgents = useCallback(async (ceoAIId: string): Promise<Agent[]> => {
        try {
            setError(null);

            // Use the CEO AI service
            const agents = await ceoAIService.getCEOAIAgents(ceoAIId);
            return agents;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading agents');
            return [];
        }
    }, []);

    // Load CEO AIs on mount
    useEffect(() => {
        loadCEOAIs();
    }, [loadCEOAIs]);

    return {
        ceoAIs,
        isLoading,
        isCreating,
        error,
        loadCEOAIs,
        createCEOAI,
        updateCEOAI,
        deleteCEOAI,
        getCEOAIById,
        updateCEOAIStatus,
        getCEOAIWorkflow,
        getCEOAIWithWorkflowStatus,
        createAgent,
        getAgents
    };
}; 