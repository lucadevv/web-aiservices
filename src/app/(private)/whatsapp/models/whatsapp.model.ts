export interface WhatsAppConfig {
    businessName: string;
    phoneNumber: string;
    isVerified: boolean;
    isActive: boolean;
    updatedAt?: Date;
}

export interface WhatsAppBot {
    id: string;
    userId: string;
    name: string;
    description?: string;
    phoneNumber: string;
    workflowId: string;
    isActive: boolean;
    settings: WhatsAppBotSettings;
    createdAt: string;
    updatedAt: string;
}

export interface WhatsAppBotSettings {
    welcomeMessage: string;
    businessHours: BusinessHours;
    autoResponses: AutoResponse[];
    fallbackMessage: string;
}

export interface BusinessHours {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
    days: string[];
}

export interface AutoResponse {
    keywords: string[];
    response: string;
    priority: number;
}

export interface WhatsAppMessage {
    id: string;
    botId: string;
    from: string;
    to: string;
    type: 'text' | 'image' | 'document' | 'audio' | 'video';
    content: string;
    timestamp: string;
    direction: 'inbound' | 'outbound';
    status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface CreateBotRequest {
    name: string;
    description?: string;
    phoneNumber: string;
    settings: WhatsAppBotSettings;
}

export interface SendMessageRequest {
    to: string;
    message: string;
    type?: 'text' | 'image' | 'document';
    mediaUrl?: string;
} 