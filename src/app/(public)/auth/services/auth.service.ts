import apiService from '@/shared/services/api.service';
import type {
    User,
    LoginCredentials,
    RegisterData,
    AuthResponse,
    PasswordResetRequest,
    PasswordResetConfirm
} from '../models/auth.model';

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiService.post<{ user: User; token: string }>('/auth/login', credentials);

        if (response.success && response.data) {
            // Guardar token en localStorage
            localStorage.setItem('aiservices_token', response.data.token);
            localStorage.setItem('aiservices_user', JSON.stringify(response.data.user));

            // Convertir a formato esperado por el frontend
            return {
                user: response.data.user,
                accessToken: response.data.token,
                refreshToken: '' // Backend no usa refresh tokens por ahora
            };
        }

        // Si no hay respuesta válida, lanzar error
        throw new Error(response.message || 'Error en el login');
    }

    async register(userData: RegisterData): Promise<AuthResponse> {
        const response = await apiService.post<{ user: User; token: string }>('/auth/register', userData);

        if (response.success && response.data) {
            // Guardar token en localStorage
            localStorage.setItem('aiservices_token', response.data.token);
            localStorage.setItem('aiservices_user', JSON.stringify(response.data.user));

            // Convertir a formato esperado por el frontend
            return {
                user: response.data.user,
                accessToken: response.data.token,
                refreshToken: '' // Backend no usa refresh tokens por ahora
            };
        }

        throw new Error(response.message || 'Error en el registro');
    }

    async logout(): Promise<void> {
        try {
            // Backend no tiene endpoint de logout, solo limpiar localStorage
            localStorage.removeItem('aiservices_token');
            localStorage.removeItem('aiservices_user');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await apiService.get<User>('/auth/me');
            return response.success ? response.data! : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    async updateProfile(updates: Partial<User>): Promise<User> {
        const response = await apiService.put<User>('/auth/profile', updates);
        return response.data!;
    }

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        await apiService.put('/auth/change-password', {
            currentPassword,
            newPassword,
        });
    }

    async requestPasswordReset(email: string): Promise<void> {
        await apiService.post('/auth/forgot-password', { email });
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        await apiService.post('/auth/reset-password', {
            token,
            newPassword,
        });
    }

    async verifyEmail(token: string): Promise<void> {
        await apiService.post('/auth/verify-email', { token });
    }

    async resendVerificationEmail(): Promise<void> {
        await apiService.post('/auth/resend-verification');
    }

    // Métodos de utilidad
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('aiservices_token');
    }

    getStoredUser(): User | null {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('aiservices_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('aiservices_token');
    }
}

export const authService = new AuthService();
export default authService; 