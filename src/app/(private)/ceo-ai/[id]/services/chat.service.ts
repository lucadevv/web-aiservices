// ===============================================
// CHAT SERVICE - CEO AI PLATFORM
// ===============================================

import { apiService } from '@/shared/services/api.service';
import type {
    SendMessageRequest,
    SendMessageResponse,
    ChatMessage,
    ChatSession
} from '../models/chat.model';

export class ChatService {
    private baseUrl = '/ceo-ai';

    /**
     * Enviar mensaje al CEO AI
     */
    async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
        try {
            const response = await apiService.post<SendMessageResponse>(
                `${this.baseUrl}/${request.ceoAIId}/chat`,
                {
                    message: request.message,
                    sessionId: request.sessionId
                }
            );

            if (!response.data) {
                throw new Error('Respuesta vacía del servidor');
            }

            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw new Error('Error al enviar mensaje');
        }
    }

    /**
     * Obtener historial de conversaciones
     */
    async getChatHistory(ceoAIId: string, sessionId?: string): Promise<ChatMessage[]> {
        try {
            const endpoint = sessionId
                ? `${this.baseUrl}/${ceoAIId}/chat/history?sessionId=${sessionId}`
                : `${this.baseUrl}/${ceoAIId}/chat/history`;

            const response = await apiService.get<ChatMessage[]>(endpoint);

            if (!response.data) {
                throw new Error('Respuesta vacía del servidor');
            }

            return response.data;
        } catch (error) {
            console.error('Error getting chat history:', error);
            throw new Error('Error al obtener historial de chat');
        }
    }

    /**
     * Obtener sesiones de chat
     */
    async getChatSessions(ceoAIId: string): Promise<ChatSession[]> {
        try {
            const response = await apiService.get<ChatSession[]>(
                `${this.baseUrl}/${ceoAIId}/chat/sessions`
            );

            if (!response.data) {
                throw new Error('Respuesta vacía del servidor');
            }

            return response.data;
        } catch (error) {
            console.error('Error getting chat sessions:', error);
            throw new Error('Error al obtener sesiones de chat');
        }
    }

    /**
     * Crear nueva sesión de chat
     */
    async createChatSession(ceoAIId: string): Promise<{ sessionId: string }> {
        try {
            const response = await apiService.post<{ sessionId: string }>(
                `${this.baseUrl}/${ceoAIId}/chat/sessions`
            );

            if (!response.data) {
                throw new Error('Respuesta vacía del servidor');
            }

            return response.data;
        } catch (error) {
            console.error('Error creating chat session:', error);
            throw new Error('Error al crear sesión de chat');
        }
    }

    /**
     * Eliminar sesión de chat
     */
    async deleteChatSession(ceoAIId: string, sessionId: string): Promise<void> {
        try {
            await apiService.delete(`${this.baseUrl}/${ceoAIId}/chat/sessions/${sessionId}`);
        } catch (error) {
            console.error('Error deleting chat session:', error);
            throw new Error('Error al eliminar sesión de chat');
        }
    }
}

export const chatService = new ChatService(); 