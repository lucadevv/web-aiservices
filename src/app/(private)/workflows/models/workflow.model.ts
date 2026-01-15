export interface Workflow {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    nodes: WorkflowNode[];
    connections: WorkflowConnections;
    settings?: WorkflowSettings;
    createdAt: string;
    updatedAt: string;
    executionCount: number;
    lastExecuted?: string;
}

export interface WorkflowNode {
    id: string;
    type: string;
    name: string;
    position: { x: number; y: number };
    parameters: Record<string, unknown>;
}

export interface WorkflowConnections {
    [nodeId: string]: {
        [outputIndex: string]: Array<{
            node: string;
            index: number;
        }>;
    };
}

export interface WorkflowSettings {
    saveExecutionProgress?: boolean;
    saveManualExecutions?: boolean;
    callerPolicy?: string;
}

export interface CreateWorkflowRequest {
    name: string;
    description?: string;
    nodes: WorkflowNode[];
    connections: WorkflowConnections;
    settings?: WorkflowSettings;
}

export interface UpdateWorkflowRequest {
    name?: string;
    description?: string;
    nodes?: WorkflowNode[];
    connections?: WorkflowConnections;
    settings?: WorkflowSettings;
}

export interface WorkflowExecution {
    id: string;
    workflowId: string;
    status: 'running' | 'success' | 'failed' | 'cancelled';
    startedAt: string;
    finishedAt?: string;
    duration?: number;
    error?: string;
    data?: unknown;
}

export interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    tags: string[];
    config: unknown;
    isPremium: boolean;
    usageCount: number;
    rating: number;
    createdAt: string;
} 