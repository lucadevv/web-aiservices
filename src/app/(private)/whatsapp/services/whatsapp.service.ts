import apiService from '../../../../shared/services/api.service';
import type {
    WhatsAppConfig,
    WhatsAppBot,
    WhatsAppMessage,
    CreateBotRequest,
    SendMessageRequest
} from '../models/whatsapp.model';

class WhatsAppService {
    // Configuración
    async getConfig(): Promise<WhatsAppConfig | null> {
        try {
            console.log('WhatsApp Service: Getting config...');
            const response = await apiService.get<WhatsAppConfig>('/whatsapp/config');
            console.log('WhatsApp Service: Config response:', response);
            return response.data || null;
        } catch (error) {
            console.error('WhatsApp Service: Error getting config:', error);
            return null;
        }
    }

    // Setup Guide
    async getSetupGuide(): Promise<unknown> {
        try {
            console.log('WhatsApp Service: Getting setup guide...');
            const response = await apiService.get('/whatsapp/setup-guide');
            console.log('WhatsApp Service: Setup guide response:', response);
            return response.data;
        } catch (error) {
            console.error('WhatsApp Service: Error getting setup guide:', error);
            return null;
        }
    }

    async setupConfig(config: {
        businessName: string;
        phoneNumber: string;
        accessToken: string;
        phoneNumberId: string;
    }): Promise<WhatsAppConfig> {
        console.log('WhatsApp Service: Setting up config...');
        const response = await apiService.post<WhatsAppConfig>('/whatsapp/setup', config);
        return response.data!;
    }

    async updateConfig(config: {
        businessName: string;
        phoneNumber: string;
        accessToken: string;
        phoneNumberId: string;
    }): Promise<WhatsAppConfig> {
        console.log('WhatsApp Service: Updating config...');
        const response = await apiService.put<WhatsAppConfig>('/whatsapp/config', config);
        return response.data!;
    }

    async verifyConfig(): Promise<boolean> {
        try {
            await apiService.post('/whatsapp/verify');
            return true;
        } catch (error) {
            return false;
        }
    }

    // Bots
    async getBots(): Promise<WhatsAppBot[]> {
        try {
            console.log('WhatsApp Service: Getting bots...');
            const response = await apiService.get<WhatsAppBot[]>('/whatsapp/bots');
            console.log('WhatsApp Service: Bots response:', response);
            return response.data || [];
        } catch (error) {
            console.error('WhatsApp Service: Error getting bots:', error);
            return [];
        }
    }

    async getBot(id: string): Promise<WhatsAppBot> {
        const response = await apiService.get<WhatsAppBot>(`/whatsapp/bots/${id}`);
        return response.data!;
    }

    async createBot(data: CreateBotRequest): Promise<WhatsAppBot> {
        try {
            console.log('WhatsApp Service: Creating bot...');
            const response = await apiService.post<WhatsAppBot>('/whatsapp/bot', data);
            console.log('WhatsApp Service: Create bot response:', response);
            return response.data!;
        } catch (error) {
            console.error('WhatsApp Service: Error creating bot:', error);
            throw error;
        }
    }

    async updateBot(id: string, data: Partial<CreateBotRequest>): Promise<WhatsAppBot> {
        const response = await apiService.put<WhatsAppBot>(`/whatsapp/bots/${id}`, data);
        return response.data!;
    }

    async deleteBot(id: string): Promise<void> {
        await apiService.delete(`/whatsapp/bots/${id}`);
    }

    async toggleBot(id: string, isActive: boolean): Promise<WhatsAppBot> {
        console.log('WhatsApp Service: Toggling bot...', { id, isActive });
        const response = await apiService.patch<WhatsAppBot>(`/whatsapp/bots/${id}/toggle`, { isActive });
        console.log('WhatsApp Service: Toggle response:', response);
        return response.data!;
    }

    // Mensajes
    async sendMessage(botId: string, data: SendMessageRequest): Promise<WhatsAppMessage> {
        const response = await apiService.post<WhatsAppMessage>(`/whatsapp/bots/${botId}/send`, data);
        return response.data!;
    }

    async getMessages(botId: string, limit: number = 50, offset: number = 0): Promise<WhatsAppMessage[]> {
        const response = await apiService.get<WhatsAppMessage[]>(
            `/whatsapp/bots/${botId}/messages?limit=${limit}&offset=${offset}`
        );
        return response.data || [];
    }

    async getMessage(id: string): Promise<WhatsAppMessage> {
        const response = await apiService.get<WhatsAppMessage>(`/whatsapp/messages/${id}`);
        return response.data!;
    }

    // Analytics
    async getBotStats(botId: string, period: string = '30d'): Promise<unknown> {
        const response = await apiService.get(`/whatsapp/bots/${botId}/stats?period=${period}`);
        return response.data;
    }

    async getDashboardStats(): Promise<unknown> {
        const response = await apiService.get('/whatsapp/dashboard-stats');
        return response.data;
    }
}

export const whatsappService = new WhatsAppService();
export default whatsappService; 