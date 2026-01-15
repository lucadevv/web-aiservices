// ===============================================
// CEO AI MODEL - FRONTEND
// ===============================================

export interface CEOAI {
    id: string;
    user_id: string;
    name: string;
    company_name: string;
    industry: string;
    description: string;
    personality: string;
    specialized_agents: Agent[];
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
    n8n_workflow_id?: string;
    n8n_status?: 'active' | 'inactive';
    workflow_info?: any;
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

export interface CEOAIWorkflowInfo {
    workflow_id: string;
    workflow_name: string;
    workflow_active: boolean;
    workflow_nodes: number;
    created_at: string;
    updated_at: string;
}

export interface CEOAIUsage {
    total_conversations: number;
    monthly_conversations: number;
    total_agents: number;
    storage_used_gb: number;
    limits: {
        max_agents: number;
        max_conversations_monthly: number;
        max_integrations: number;
        premium_features_enabled: boolean;
    };
} 