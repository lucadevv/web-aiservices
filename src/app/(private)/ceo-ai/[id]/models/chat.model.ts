// ===============================================
// CHAT MODEL - CEO AI PLATFORM
// ===============================================

export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: string;
    sessionId: string;
}

export interface ChatSession {
    id: string;
    ceoAIId: string;
    userId: string;
    createdAt: string;
    lastMessageAt: string;
    messageCount: number;
    messages: ChatMessage[];
}

export interface SendMessageRequest {
    message: string;
    sessionId?: string;
    ceoAIId: string;
}

export interface SendMessageResponse {
    response: string;
    sessionId: string;
    timestamp: string;
    messageId: string;
}

export interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    sessionId: string | null;
    isTyping: boolean;
} 