'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import whatsappService from '../services/whatsapp.service';
import type { WhatsAppConfig } from '../models/whatsapp.model';

interface UpdateConfigFormData {
    businessName: string;
    phoneNumber: string;
    accessToken: string;
    phoneNumberId: string;
}

export default function WhatsAppConfigPage() {
    const router = useRouter();
    const [config, setConfig] = useState<WhatsAppConfig | null>(null);
    const [formData, setFormData] = useState<UpdateConfigFormData>({
        businessName: '',
        phoneNumber: '',
        accessToken: '',
        phoneNumberId: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const configData = await whatsappService.getConfig();
            if (!configData) {
                router.push('/dashboard/whatsapp/setup');
                return;
            }
            setConfig(configData);
            // Pre-llenar el formulario con datos existentes
            setFormData(prev => ({
                ...prev,
                businessName: configData.businessName || '',
                phoneNumber: configData.phoneNumber || ''
            }));
        } catch (err) {
            console.error('Error loading config:', err);
            router.push('/dashboard/whatsapp/setup');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await whatsappService.updateConfig(formData);
            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard/whatsapp');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar la configuración');
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateForm = () => {
        return formData.businessName.trim() &&
            formData.phoneNumber.trim() &&
            formData.accessToken.trim() &&
            formData.phoneNumberId.trim();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando configuración...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Editar Configuración WhatsApp</h1>
                    <p className="mt-2 text-gray-600">
                        Actualiza la configuración de tu cuenta de WhatsApp Business
                    </p>
                </div>
                <Link
                    href="/dashboard/whatsapp"
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Volver
                </Link>
            </div>

            {/* Current Config Status */}
            {config && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración Actual</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Negocio</p>
                            <p className="font-medium">{config.businessName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Número de Teléfono</p>
                            <p className="font-medium">{config.phoneNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Estado</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.isVerified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {config.isVerified ? 'Verificado' : 'Pendiente'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Activo</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {config.isActive ? 'Sí' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Actualizar Configuración
                </h2>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-800 font-medium">
                                ¡Configuración actualizada exitosamente! Redirigiendo...
                            </span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-800">{error}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Negocio *
                            </label>
                            <input
                                type="text"
                                id="businessName"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Mi Restaurante"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Número de Teléfono *
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="+51987654321"
                                pattern="^\+\d{10,15}$"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Formato: +51987654321 (con código de país)
                            </p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700 mb-2">
                            Access Token *
                        </label>
                        <input
                            type="password"
                            id="accessToken"
                            name="accessToken"
                            value={formData.accessToken}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="EAAxxxxxxxx..."
                            required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Token temporal de acceso de Meta for Developers
                        </p>
                    </div>

                    <div>
                        <label htmlFor="phoneNumberId" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number ID *
                        </label>
                        <input
                            type="text"
                            id="phoneNumberId"
                            name="phoneNumberId"
                            value={formData.phoneNumberId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="123456789"
                            required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            ID del número de teléfono en Meta for Developers
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-blue-800">Información Importante</h3>
                                <p className="mt-1 text-sm text-blue-700">
                                    Al actualizar la configuración, todos los bots existentes seguirán funcionando con la nueva configuración.
                                    Solo actualiza estos campos si necesitas cambiar los tokens de acceso o el número de teléfono.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6">
                        <Link
                            href="/dashboard/whatsapp"
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={!validateForm() || isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Actualizando...
                                </div>
                            ) : (
                                'Actualizar Configuración'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 