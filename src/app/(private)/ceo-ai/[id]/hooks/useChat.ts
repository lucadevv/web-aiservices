// ===============================================
// CHAT HOOK - CEO AI PLATFORM
// ===============================================

import { useState, useCallback, useEffect } from 'react';
import { chatService } from '../services/chat.service';
import type { ChatMessage, ChatState, SendMessageRequest } from '../models/chat.model';

export function useChat(ceoAIId: string) {
    const [state, setState] = useState<ChatState>({
        messages: [],
        isLoading: false,
        error: null,
        sessionId: null,
        isTyping: false
    });

    // Generar sessionId único al inicializar
    useEffect(() => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setState(prev => ({ ...prev, sessionId }));
    }, []);

    // Cargar historial de chat
    const loadChatHistory = useCallback(async (sessionId?: string) => {
        if (!ceoAIId) return;

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const messages = await chatService.getChatHistory(ceoAIId, sessionId);
            setState(prev => ({
                ...prev,
                messages,
                isLoading: false
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Error al cargar historial',
                isLoading: false
            }));
        }
    }, [ceoAIId]);

    // Enviar mensaje
    const sendMessage = useCallback(async (content: string) => {
        if (!ceoAIId || !content.trim()) return;

        const userMessage: ChatMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            content: content.trim(),
            role: 'user',
            timestamp: new Date().toISOString(),
            sessionId: state.sessionId || ''
        };

        // Agregar mensaje del usuario inmediatamente
        setState(prev => ({
            ...prev,
            messages: [...prev.messages, userMessage],
            isTyping: true,
            error: null
        }));

        try {
            const request: SendMessageRequest = {
                message: content.trim(),
                sessionId: state.sessionId || undefined,
                ceoAIId
            };

            const response = await chatService.sendMessage(request);

            const assistantMessage: ChatMessage = {
                id: response.messageId,
                content: response.response,
                role: 'assistant',
                timestamp: response.timestamp,
                sessionId: response.sessionId
            };

            // Actualizar sessionId si es nuevo
            const newSessionId = response.sessionId;

            setState(prev => ({
                ...prev,
                messages: [...prev.messages, assistantMessage],
                isTyping: false,
                sessionId: newSessionId || prev.sessionId
            }));

        } catch (error) {
            // Remover mensaje del usuario si falla
            setState(prev => ({
                ...prev,
                messages: prev.messages.filter(msg => msg.id !== userMessage.id),
                isTyping: false,
                error: error instanceof Error ? error.message : 'Error al enviar mensaje'
            }));
        }
    }, [ceoAIId, state.sessionId]);

    // Limpiar chat
    const clearChat = useCallback(() => {
        setState(prev => ({
            ...prev,
            messages: [],
            error: null
        }));
    }, []);

    // Limpiar error
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // Cargar historial al montar el componente
    useEffect(() => {
        if (ceoAIId && state.sessionId) {
            loadChatHistory(state.sessionId);
        }
    }, [ceoAIId, state.sessionId, loadChatHistory]);

    return {
        // Estado
        messages: state.messages,
        isLoading: state.isLoading,
        error: state.error,
        sessionId: state.sessionId,
        isTyping: state.isTyping,

        // Acciones
        sendMessage,
        loadChatHistory,
        clearChat,
        clearError
    };
} 