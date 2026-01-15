// ===============================================
// CEO AI SERVICE - FRONTEND
// ===============================================

import { apiService } from '@/shared/services/api.service';
import type {
    CEOAI,
    Agent,
    CreateAgentData,
    CreateAgentResponse,
    CEOAIWorkflowInfo,
    CEOAIUsage
} from '../models/ceo-ai.model';

export class CEOAIService {
    private static instance: CEOAIService;
    private baseUrl = '/ceo-ai';

    private constructor() { }

    public static getInstance(): CEOAIService {
        if (!CEOAIService.instance) {
            CEOAIService.instance = new CEOAIService();
        }
        return CEOAIService.instance;
    }

    /**
     * Get specific CEO AI by ID
     */
    async getCEOAIById(id: string): Promise<CEOAI> {
        try {
            const response = await apiService.get<CEOAI>(`${this.baseUrl}/${id}`);
            if (!response.data) {
                throw new Error('CEO AI not found');
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching CEO AI:', error);
            throw error;
        }
    }

    /**
     * Update CEO AI
     */
    async updateCEOAI(id: string, data: Partial<CEOAI>): Promise<CEOAI> {
        try {
            const response = await apiService.put<CEOAI>(`${this.baseUrl}/${id}`, data);
            if (!response.data) {
                throw new Error('Failed to update CEO AI');
            }
            return response.data;
        } catch (error) {
            console.error('Error updating CEO AI:', error);
            throw error;
        }
    }

    /**
     * Delete CEO AI
     */
    async deleteCEOAI(id: string): Promise<void> {
        try {
            await apiService.delete(`${this.baseUrl}/${id}`);
        } catch (error) {
            console.error('Error deleting CEO AI:', error);
            throw error;
        }
    }

    /**
     * Update CEO AI status (activate/deactivate)
     */
    async updateCEOAIStatus(id: string, status: 'active' | 'inactive'): Promise<CEOAI> {
        try {
            const response = await apiService.put<CEOAI>(`${this.baseUrl}/${id}/status`, { status });
            if (!response.data) {
                throw new Error('Failed to update CEO AI status');
            }
            return response.data;
        } catch (error) {
            console.error('Error updating CEO AI status:', error);
            throw error;
        }
    }

    /**
     * Get CEO AI workflow information
     */
    async getCEOAIWorkflow(id: string): Promise<CEOAIWorkflowInfo> {
        try {
            const response = await apiService.get<CEOAIWorkflowInfo>(`${this.baseUrl}/${id}/workflow`);
            if (!response.data) {
                throw new Error('No workflow data received');
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching CEO AI workflow:', error);
            throw error;
        }
    }

    /**
     * Get CEO AI usage statistics
     */
    async getCEOAIUsage(id: string): Promise<CEOAIUsage> {
        try {
            const response = await apiService.get<CEOAIUsage>(`${this.baseUrl}/${id}/usage`);
            if (!response.data) {
                throw new Error('No usage data received');
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching CEO AI usage:', error);
            throw error;
        }
    }

    /**
     * Add specialized agent to CEO AI
     */
    async addSpecializedAgent(ceoAIId: string, agentData: CreateAgentData): Promise<CreateAgentResponse> {
        try {
            const response = await apiService.post<CreateAgentResponse>(`${this.baseUrl}/${ceoAIId}/agents`, agentData);
            if (!response.data) {
                throw new Error('No data received from API');
            }
            return response.data;
        } catch (error) {
            console.error('Error adding specialized agent:', error);
            throw error;
        }
    }

    /**
     * Get agents for CEO AI
     */
    async getCEOAIAgents(ceoAIId: string): Promise<Agent[]> {
        try {
            const response = await apiService.get<Agent[]>(`${this.baseUrl}/${ceoAIId}/agents`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching CEO AI agents:', error);
            throw error;
        }
    }

    /**
     * Get CEO AI with workflow status
     */
    async getCEOAIWithWorkflowStatus(id: string): Promise<CEOAI> {
        try {
            // Get basic CEO AI
            const ceoAI = await this.getCEOAIById(id);

            // If it has n8n workflow, get real status
            if (ceoAI.n8n_workflow_id) {
                try {
                    const workflowInfo = await this.getCEOAIWorkflow(id);
                    return {
                        ...ceoAI,
                        n8n_status: workflowInfo.workflow_active ? 'active' : 'inactive',
                        workflow_info: workflowInfo
                    };
                } catch (workflowError) {
                    // If can't get workflow, use backend status
                    return {
                        ...ceoAI,
                        n8n_status: ceoAI.status === 'suspended' ? 'inactive' : ceoAI.status,
                        workflow_info: null
                    };
                }
            }

            return {
                ...ceoAI,
                n8n_status: ceoAI.status === 'suspended' ? 'inactive' : ceoAI.status,
                workflow_info: null
            };
        } catch (error) {
            console.error('Error getting CEO AI with workflow status:', error);
            throw error;
        }
    }
}

export const ceoAIService = CEOAIService.getInstance(); 