import { authService } from '@/app/(public)/auth/services/auth.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface ApiError {
    message: string;
    status: number;
    code?: string;
}

class ApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        console.log('API Service: Making request to:', url);

        // Obtener token del AuthService
        const token = authService.getToken();

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            console.log('🚀 API Service: Conectando al backend real en:', url);
            console.log('📤 API Service: Enviando request con config:', config);
            const response = await fetch(url, config);
            console.log('📥 API Service: Respuesta del backend - Status:', response.status);

            if (!response.ok) {
                // Manejar errores de autenticación
                if (response.status === 401) {
                    console.log('🔐 API Service: 401 error, redirigiendo al login...');
                    this.redirectToLogin();
                    throw new Error('Unauthorized');
                }

                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData?.message || errorData?.error || `HTTP error! status: ${response.status}`;
                console.error('❌ API Service: Request failed:', errorMessage);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('✅ API Service: Conexión exitosa al backend real, datos:', data);
            return data;
        } catch (error) {
            console.error('❌ API Service: Error en request:', error);
            console.error('🔍 Detalles del error:', {
                endpoint,
                method: options.method,
                url,
                errorType: error instanceof Error ? error.constructor.name : 'Unknown',
                errorMessage: error instanceof Error ? error.message : String(error)
            });

            // Verificar si es un error de conexión al backend
            if (error instanceof TypeError && error.message.includes('fetch')) {
                console.error('🚨 ERROR CRÍTICO: No se puede conectar al backend');
                console.error('📍 URL intentada:', url);
                console.error('🔧 Verifica que el backend esté corriendo en http://localhost:8000');
                console.error('💡 Ejecuta: cd backend && bun run dev');
            }

            // NO USAR MOCKS - Dejar que el error se propague para ver el problema real
            throw error;
        }
    }

    // MOCKS ELIMINADOS - Ahora solo conectamos al backend real

    private redirectToLogin(): void {
        if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
        }
    }

    // Métodos HTTP
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    // Upload de archivos
    async upload<T>(endpoint: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
        const formData = new FormData();
        formData.append('file', file);

        const token = authService.getToken();

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && onProgress) {
                    const progress = (event.loaded / event.total) * 100;
                    onProgress(progress);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Invalid JSON response'));
                    }
                } else {
                    reject(new Error(`HTTP error! status: ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error'));
            });

            xhr.open('POST', `${this.baseURL}${endpoint}`);
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
            xhr.send(formData);
        });
    }
}

export const apiService = new ApiService();
export default apiService; 