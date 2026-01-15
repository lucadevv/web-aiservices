'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import whatsappService from '../services/whatsapp.service';

interface CreateBotFormData {
    name: string;
    description: string;
    welcomeMessage: string;
    businessHours: {
        enabled: boolean;
        start: string;
        end: string;
        timezone: string;
        days: string[];
    };
    autoResponses: Array<{
        keywords: string[];
        response: string;
        priority: number;
    }>;
    fallbackMessage: string;
}

export default function CreateWhatsAppBotPage() {
    const router = useRouter();
    const [config, setConfig] = useState<any>(null);
    const [formData, setFormData] = useState<CreateBotFormData>({
        name: '',
        description: '',
        welcomeMessage: '¡Hola! Bienvenido a nuestro negocio. ¿En qué puedo ayudarte?',
        businessHours: {
            enabled: true,
            start: '09:00',
            end: '18:00',
            timezone: 'America/Lima',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        },
        autoResponses: [
            {
                keywords: ['hola', 'buenos días', 'buenas'],
                response: '¡Hola! Gracias por contactarnos. ¿En qué puedo ayudarte?',
                priority: 1
            }
        ],
        fallbackMessage: 'Gracias por tu mensaje. Te responderemos pronto.'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        checkWhatsAppConfig();
    }, []);

    const checkWhatsAppConfig = async () => {
        try {
            const configData = await whatsappService.getConfig();
            if (!configData) {
                router.push('/dashboard/whatsapp/setup');
                return;
            }
            setConfig(configData);
        } catch (err) {
            console.error('Error checking WhatsApp config:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBusinessHoursChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            businessHours: {
                ...prev.businessHours,
                [field]: value
            }
        }));
    };

    const addAutoResponse = () => {
        setFormData(prev => ({
            ...prev,
            autoResponses: [
                ...prev.autoResponses,
                {
                    keywords: [],
                    response: '',
                    priority: prev.autoResponses.length + 1
                }
            ]
        }));
    };

    const updateAutoResponse = (index: number, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            autoResponses: prev.autoResponses.map((response, i) =>
                i === index ? { ...response, [field]: value } : response
            )
        }));
    };

    const removeAutoResponse = (index: number) => {
        setFormData(prev => ({
            ...prev,
            autoResponses: prev.autoResponses.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await whatsappService.createBot({
                name: formData.name,
                description: formData.description,
                phoneNumber: config.phoneNumber,
                settings: {
                    welcomeMessage: formData.welcomeMessage,
                    businessHours: formData.businessHours,
                    autoResponses: formData.autoResponses,
                    fallbackMessage: formData.fallbackMessage
                }
            });

            router.push('/dashboard/whatsapp');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el bot');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verificando configuración...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Crear Bot de WhatsApp</h1>
                    <p className="mt-2 text-gray-600">
                        Configura un bot automático para responder mensajes de WhatsApp
                    </p>
                </div>
                <Link
                    href="/dashboard/whatsapp"
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Volver
                </Link>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Básica</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Bot *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Bot de Soporte"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Bot para atención al cliente"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Welcome Message */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mensaje de Bienvenida</h2>
                        <div>
                            <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700 mb-2">
                                Mensaje de bienvenida
                            </label>
                            <textarea
                                id="welcomeMessage"
                                name="welcomeMessage"
                                value={formData.welcomeMessage}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="¡Hola! Bienvenido a nuestro negocio..."
                            />
                        </div>
                    </div>

                    {/* Business Hours */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Horario de Atención</h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="businessHoursEnabled"
                                    checked={formData.businessHours.enabled}
                                    onChange={(e) => handleBusinessHoursChange('enabled', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="businessHoursEnabled" className="ml-2 text-sm text-gray-700">
                                    Habilitar horario de atención
                                </label>
                            </div>

                            {formData.businessHours.enabled && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hora de inicio
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.businessHours.start}
                                            onChange={(e) => handleBusinessHoursChange('start', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hora de fin
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.businessHours.end}
                                            onChange={(e) => handleBusinessHoursChange('end', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Zona horaria
                                        </label>
                                        <select
                                            value={formData.businessHours.timezone}
                                            onChange={(e) => handleBusinessHoursChange('timezone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="America/Lima">Lima (GMT-5)</option>
                                            <option value="America/Mexico_City">México (GMT-6)</option>
                                            <option value="America/New_York">Nueva York (GMT-5)</option>
                                            <option value="Europe/Madrid">Madrid (GMT+1)</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Auto Responses */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Respuestas Automáticas</h2>
                            <button
                                type="button"
                                onClick={addAutoResponse}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Agregar respuesta
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.autoResponses.map((response, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium text-gray-900">
                                            Respuesta {index + 1}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => removeAutoResponse(index)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Palabras clave (separadas por comas)
                                            </label>
                                            <input
                                                type="text"
                                                value={response.keywords.join(', ')}
                                                onChange={(e) => updateAutoResponse(index, 'keywords', e.target.value.split(',').map(k => k.trim()))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="hola, buenos días, ayuda"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Respuesta
                                            </label>
                                            <textarea
                                                value={response.response}
                                                onChange={(e) => updateAutoResponse(index, 'response', e.target.value)}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="¡Hola! ¿En qué puedo ayudarte?"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fallback Message */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mensaje de Respaldo</h2>
                        <div>
                            <label htmlFor="fallbackMessage" className="block text-sm font-medium text-gray-700 mb-2">
                                Mensaje cuando no hay respuesta automática
                            </label>
                            <textarea
                                id="fallbackMessage"
                                name="fallbackMessage"
                                value={formData.fallbackMessage}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Gracias por tu mensaje. Te responderemos pronto."
                            />
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex items-center justify-between pt-6">
                        <Link
                            href="/dashboard/whatsapp"
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={!formData.name || isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creando bot...
                                </div>
                            ) : (
                                'Crear Bot'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 