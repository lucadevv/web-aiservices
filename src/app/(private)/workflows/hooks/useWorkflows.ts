'use client';

import { useState, useCallback } from 'react';
import workflowService from '../services/workflow.service';
import type { Workflow, CreateWorkflowRequest, UpdateWorkflowRequest } from '../services/workflow.service';

interface UseWorkflowsReturn {
    workflows: Workflow[];
    isLoading: boolean;
    error: string | null;
    fetchWorkflows: () => Promise<void>;
    createWorkflow: (data: CreateWorkflowRequest) => Promise<Workflow>;
    updateWorkflow: (id: string, data: UpdateWorkflowRequest) => Promise<Workflow>;
    deleteWorkflow: (id: string) => Promise<void>;
    toggleWorkflow: (id: string, isActive: boolean) => Promise<Workflow>;
    executeWorkflow: (id: string, data?: unknown) => Promise<unknown>;
}

export function useWorkflows(): UseWorkflowsReturn {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWorkflows = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await workflowService.getWorkflows();
            setWorkflows(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching workflows');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createWorkflow = useCallback(async (data: CreateWorkflowRequest): Promise<Workflow> => {
        setIsLoading(true);
        setError(null);
        try {
            const newWorkflow = await workflowService.createWorkflow(data);
            setWorkflows(prev => [...prev, newWorkflow]);
            return newWorkflow;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating workflow');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateWorkflow = useCallback(async (id: string, data: UpdateWorkflowRequest): Promise<Workflow> => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedWorkflow = await workflowService.updateWorkflow(id, data);
            setWorkflows(prev => prev.map(w => w.id === id ? updatedWorkflow : w));
            return updatedWorkflow;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating workflow');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteWorkflow = useCallback(async (id: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await workflowService.deleteWorkflow(id);
            setWorkflows(prev => prev.filter(w => w.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting workflow');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const toggleWorkflow = useCallback(async (id: string, isActive: boolean): Promise<Workflow> => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedWorkflow = await workflowService.toggleWorkflow(id, isActive);
            setWorkflows(prev => prev.map(w => w.id === id ? updatedWorkflow : w));
            return updatedWorkflow;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error toggling workflow');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const executeWorkflow = useCallback(async (id: string, data?: unknown): Promise<unknown> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await workflowService.executeWorkflow(id, data);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error executing workflow');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        workflows,
        isLoading,
        error,
        fetchWorkflows,
        createWorkflow,
        updateWorkflow,
        deleteWorkflow,
        toggleWorkflow,
        executeWorkflow,
    };
} 