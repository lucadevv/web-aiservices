// ===============================================
// WORKFLOW SERVICE - FRONTEND
// ===============================================

import { apiService } from '../../../../shared/services/api.service';

export interface Workflow {
    id: string;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    nodes_count: number;
    executions_count: number;
}

export interface CreateWorkflowRequest {
    name: string;
    description?: string;
}

export interface UpdateWorkflowRequest {
    name?: string;
    description?: string;
    is_active?: boolean;
}

export class WorkflowService {
    private static instance: WorkflowService;
    private baseUrl = '/workflows';

    private constructor() { }

    public static getInstance(): WorkflowService {
        if (!WorkflowService.instance) {
            WorkflowService.instance = new WorkflowService();
        }
        return WorkflowService.instance;
    }

    async getWorkflows(): Promise<Workflow[]> {
        try {
            const response = await apiService.get<Workflow[]>(this.baseUrl);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching workflows:', error);
            throw error;
        }
    }

    async getWorkflowById(id: string): Promise<Workflow> {
        try {
            const response = await apiService.get<Workflow>(`${this.baseUrl}/${id}`);
            if (!response.data) {
                throw new Error('Workflow not found');
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching workflow:', error);
            throw error;
        }
    }

    async createWorkflow(data: CreateWorkflowRequest): Promise<Workflow> {
        try {
            const response = await apiService.post<Workflow>(this.baseUrl, data);
            if (!response.data) {
                throw new Error('No workflow data received');
            }
            return response.data;
        } catch (error) {
            console.error('Error creating workflow:', error);
            throw error;
        }
    }

    async updateWorkflow(id: string, data: UpdateWorkflowRequest): Promise<Workflow> {
        try {
            const response = await apiService.put<Workflow>(`${this.baseUrl}/${id}`, data);
            if (!response.data) {
                throw new Error('No workflow data received');
            }
            return response.data;
        } catch (error) {
            console.error('Error updating workflow:', error);
            throw error;
        }
    }

    async deleteWorkflow(id: string): Promise<void> {
        try {
            await apiService.delete(`${this.baseUrl}/${id}`);
        } catch (error) {
            console.error('Error deleting workflow:', error);
            throw error;
        }
    }

    async toggleWorkflow(id: string, isActive: boolean): Promise<Workflow> {
        try {
            const response = await apiService.put<Workflow>(`${this.baseUrl}/${id}/toggle`, { is_active: isActive });
            if (!response.data) {
                throw new Error('No workflow data received');
            }
            return response.data;
        } catch (error) {
            console.error('Error toggling workflow:', error);
            throw error;
        }
    }

    async executeWorkflow(id: string, data?: unknown): Promise<unknown> {
        try {
            const response = await apiService.post<unknown>(`${this.baseUrl}/${id}/execute`, data);
            return response.data;
        } catch (error) {
            console.error('Error executing workflow:', error);
            throw error;
        }
    }

    async getWorkflowExecutions(id: string): Promise<any[]> {
        try {
            const response = await apiService.get<any[]>(`${this.baseUrl}/${id}/executions`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching workflow executions:', error);
            throw error;
        }
    }
}

export default WorkflowService.getInstance(); 