// ===============================================
// CEO AI SERVICE - FRONTEND
// ===============================================

import { apiService } from '../../../../shared/services/api.service';

export interface CEOAI {
    id: string;
    user_id: string;
    name: string;
    company_name: string;
    industry: string;
    description: string;
    personality: string;
    specialized_agents: any[];
    active_nodes: any[];
    usage_stats: {
        total_conversations: number;
        monthly_conversations: number;
        total_agents: number;
        storage_used_gb: number;
    };
    limits: {
        max_agents: number;
        max_conversations_monthly: number;
        max_integrations: number;
        premium_features_enabled: boolean;
    };
    status: 'active' | 'inactive' | 'suspended';
    created_at: string;
    updated_at: string;
    last_active: string;
}

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
     * Get all CEO AIs for the current user
     */
    async getCEOAIList(): Promise<CEOAI[]> {
        try {
            const response = await apiService.get<CEOAI[]>(this.baseUrl);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching CEO AI list:', error);
            throw error;
        }
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
     * Create new CEO AI
     */
    async createCEOAI(data: CreateCEOAIRequest): Promise<CreateCEOAIResponse> {
        try {
            const response = await apiService.post<CreateCEOAIResponse>(this.baseUrl, data);
            if (!response.data) {
                throw new Error('No data received from API');
            }
            return response.data;
        } catch (error) {
            console.error('Error creating CEO AI:', error);
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
     * Get usage statistics for CEO AI
     */
    async getCEOAIUsage(id: string): Promise<any> {
        try {
            const response = await apiService.get<{ data: any }>(`${this.baseUrl}/${id}/usage`);
            return response.data;
        } catch (error) {
            console.error('Error fetching CEO AI usage:', error);
            throw error;
        }
    }

    /**
     * Add specialized agent to CEO AI
     */
    async addSpecializedAgent(ceoAIId: string, agentData: any): Promise<any> {
        try {
            const response = await apiService.post<{ data: any }>(`${this.baseUrl}/${ceoAIId}/agents`, agentData);
            return response.data;
        } catch (error) {
            console.error('Error adding specialized agent:', error);
            throw error;
        }
    }

    /**
     * Get agents for CEO AI
     */
    async getCEOAIAgents(ceoAIId: string): Promise<any[]> {
        try {
            const response = await apiService.get<any[]>(`${this.baseUrl}/${ceoAIId}/agents`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching CEO AI agents:', error);
            throw error;
        }
    }

    /**
     * Get CEO AI workflow information
     */
    async getCEOAIWorkflow(id: string): Promise<any> {
        try {
            const response = await apiService.get<any>(`${this.baseUrl}/${id}/workflow`);
            return response.data;
        } catch (error) {
            console.error('Error fetching CEO AI workflow:', error);
            throw error;
        }
    }
}

export const ceoAIService = CEOAIService.getInstance(); 