'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import whatsappService from './services/whatsapp.service';

interface WhatsAppBot {
    id: string;
    name: string;
    description?: string;
    phoneNumber: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface WhatsAppConfig {
    phoneNumber: string;
    isVerified: boolean;
}

export default function WhatsAppPage() {
    const [bots, setBots] = useState<WhatsAppBot[]>([]);
    const [config, setConfig] = useState<WhatsAppConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [botsData, configData] = await Promise.all([
                whatsappService.getBots(),
                whatsappService.getConfig(),
            ]);
            setBots(botsData);
            setConfig(configData);
        } catch (err) {
            setError('Error al cargar los datos');
            console.error('Error loading WhatsApp data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleBot = async (id: string, isActive: boolean) => {
        try {
            console.log('Toggle bot - Before:', { id, isActive, currentBots: bots });
            await whatsappService.toggleBot(id, isActive);
            console.log('Toggle bot - API call successful');
            setBots(prev => {
                const updated = prev.map(bot =>
                    bot.id === id ? { ...bot, isActive } : bot
                );
                console.log('Toggle bot - After state update:', updated);
                return updated;
            });
        } catch (error) {
            console.error('Error toggling bot:', error);
        }
    };

    const handleDeleteBot = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este bot? Esta acción no se puede deshacer.')) {
            try {
                await whatsappService.deleteBot(id);
                setBots(prev => prev.filter(bot => bot.id !== id));
            } catch (error) {
                console.error('Error deleting bot:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando bots de WhatsApp...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bots de WhatsApp</h1>
                    <p className="text-gray-600 mt-1">
                        Gestiona tus bots de WhatsApp Business
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    {!config && (
                        <Link
                            href="/dashboard/whatsapp/setup"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Configurar WhatsApp
                        </Link>
                    )}
                    <Link
                        href="/dashboard/whatsapp/new"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Crear Bot
                    </Link>
                </div>
            </div>

            {/* Setup Alert */}
            {!config && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Configuración de WhatsApp requerida
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                    Para crear bots de WhatsApp, primero necesitas configurar tu cuenta de WhatsApp Business API.
                                </p>
                            </div>
                            <div className="mt-4">
                                <Link
                                    href="/dashboard/whatsapp/setup"
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Configurar ahora
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* WhatsApp Config Status */}
            {config && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">WhatsApp Business API</h3>
                                <p className="text-sm text-gray-500">
                                    Número: {config.phoneNumber} • Estado: {config.isVerified ? 'Verificado' : 'Pendiente'}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/whatsapp/config"
                            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                            Editar configuración
                        </Link>
                    </div>
                </div>
            )}

            {/* Bots List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {error && (
                    <div className="p-6 border-b border-gray-200">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    </div>
                )}

                {bots.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay bots de WhatsApp</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Comienza creando tu primer bot de WhatsApp para automatizar las respuestas a tus clientes.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/dashboard/whatsapp/new"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Crear Bot
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {bots.map((bot) => (
                            <div key={bot.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-lg font-medium text-gray-900 truncate">
                                                {bot.name}
                                            </h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bot.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {bot.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        {bot.description && (
                                            <p className="mt-1 text-sm text-gray-500 truncate">
                                                {bot.description}
                                            </p>
                                        )}
                                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                            <span>📱 {bot.phoneNumber}</span>
                                            <span>•</span>
                                            <span>Creado {new Date(bot.createdAt).toLocaleDateString('es-ES')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => handleToggleBot(bot.id, !bot.isActive)}
                                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${bot.isActive
                                                ? 'text-orange-700 bg-orange-100 hover:bg-orange-200'
                                                : 'text-green-700 bg-green-100 hover:bg-green-200'
                                                }`}
                                        >
                                            {bot.isActive ? 'Desactivar' : 'Activar'}
                                        </button>
                                        <Link
                                            href={`/dashboard/whatsapp/${bot.id}`}
                                            className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteBot(bot.id)}
                                            className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Bots</p>
                            <p className="text-2xl font-bold text-gray-900">{bots.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Activos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {bots.filter(bot => bot.isActive).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Mensajes Hoy</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Info */}
            <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">¿Qué pueden hacer tus bots de WhatsApp?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-900">Respuestas automáticas</p>
                            <p className="text-sm text-blue-700">Responde automáticamente a mensajes frecuentes</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-900">Horarios de atención</p>
                            <p className="text-sm text-blue-700">Configura horarios específicos de respuesta</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-900">Integración con IA</p>
                            <p className="text-sm text-blue-700">Respuestas inteligentes con procesamiento de lenguaje natural</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-900">Analytics detallados</p>
                            <p className="text-sm text-blue-700">Métricas de conversación y rendimiento</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 