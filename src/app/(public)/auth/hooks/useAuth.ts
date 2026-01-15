'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../services/auth.service';
import type { User, LoginCredentials, RegisterData } from '../models/auth.model';

interface UseAuthReturn {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const isAuthenticated = !!user;

    const refreshUser = useCallback(async () => {
        try {
            console.log('🔄 Refreshing user...');

            // Solo hacer la petición si hay un token almacenado
            if (!authService.isAuthenticated()) {
                console.log('❌ No hay token, usuario no autenticado');
                setUser(null);
                return;
            }

            const currentUser = await authService.getCurrentUser();
            console.log('✅ Usuario obtenido:', currentUser);

            if (currentUser) {
                setUser(currentUser);
            } else {
                console.log('❌ No se pudo obtener usuario, limpiando datos');
                setUser(null);
                authService.logout();
            }
        } catch (error) {
            console.error('❌ Error refreshing user:', error);
            setUser(null);
            // Limpiar tokens si hay error
            authService.logout();
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            console.log('🔐 Iniciando login...');
            const response = await authService.login(credentials);

            // Verificar que la respuesta tenga los datos necesarios
            if (!response || !response.user) {
                throw new Error('Respuesta inválida del servidor');
            }

            console.log('✅ Login exitoso:', response.user);
            setUser(response.user);
            router.push('/dashboard');
        } catch (err) {
            console.error('❌ Login error:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const register = useCallback(async (userData: RegisterData) => {
        setIsLoading(true);
        try {
            console.log('📝 Iniciando registro...');
            const response = await authService.register(userData);
            console.log('✅ Registro exitoso:', response.user);
            setUser(response.user);
            router.push('/dashboard');
        } catch (error) {
            console.error('❌ Register error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log('🚪 Cerrando sesión...');
            await authService.logout();
            setUser(null);
            router.push('/auth/login');
        } catch (error) {
            console.error('❌ Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const updateProfile = useCallback(async (updates: Partial<User>) => {
        try {
            const updatedUser = await authService.updateProfile(updates);
            setUser(updatedUser);
        } catch (error) {
            console.error('❌ Update profile error:', error);
            throw error;
        }
    }, []);

    // Inicializar usuario al cargar - SOLO UNA VEZ
    useEffect(() => {
        const initializeAuth = async () => {
            console.log('🚀 Inicializando autenticación...');

            // Primero intentar obtener usuario del localStorage
            const storedUser = authService.getStoredUser();
            const hasToken = authService.isAuthenticated();

            console.log('📦 Usuario almacenado:', storedUser);
            console.log('🔑 Token disponible:', hasToken);

            if (storedUser && hasToken) {
                console.log('✅ Usando usuario almacenado');
                setUser(storedUser);
                setIsLoading(false);
            } else {
                console.log('🔄 Intentando refrescar usuario desde servidor...');
                // Si no hay usuario almacenado, intentar refrescar desde el servidor
                await refreshUser();
            }
        };

        initializeAuth();
    }, []); // Sin dependencias para evitar bucles

    return {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
    };
} 