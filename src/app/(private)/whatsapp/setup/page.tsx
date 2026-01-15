'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import whatsappService from '../services/whatsapp.service';

interface SetupGuide {
    title: string;
    description: string;
    steps: Array<{
        step: number;
        title: string;
        description: string;
        action?: string;
        url?: string;
        time: string;
        guide?: string[];
        endpoint?: string;
        fields?: string[];
    }>;
    help: {
        videos: Array<{
            title: string;
            url: string;
            duration: string;
        }>;
        support: string;
    };
}

interface SetupFormData {
    businessName: string;
    phoneNumber: string;
    accessToken: string;
    phoneNumberId: string;
}

export default function WhatsAppSetupPage() {
    const router = useRouter();
    const [guide, setGuide] = useState<SetupGuide | null>(null);
    const [formData, setFormData] = useState<SetupFormData>({
        businessName: '',
        phoneNumber: '',
        accessToken: '',
        phoneNumberId: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        loadSetupGuide();
    }, []);

    const loadSetupGuide = async () => {
        try {
            const guideData = await whatsappService.getSetupGuide();
            setGuide(guideData as SetupGuide);
        } catch (err) {
            console.error('Error loading setup guide:', err);
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
            await whatsappService.setupConfig({
                businessName: formData.businessName,
                phoneNumber: formData.phoneNumber,
                accessToken: formData.accessToken,
                phoneNumberId: formData.phoneNumberId
            });

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard/whatsapp');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al configurar WhatsApp');
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
                    <p className="mt-4 text-gray-600">Cargando guía de configuración...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Configurar WhatsApp Business</h1>
                <p className="mt-2 text-gray-600">
                    Conecta tu cuenta de WhatsApp Business para crear bots automáticos
                </p>
            </div>

            {/* Setup Guide */}
            {guide && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        {guide.title}
                    </h2>
                    <p className="text-gray-600 mb-6">{guide.description}</p>

                    <div className="space-y-6">
                        {guide.steps.map((step) => (
                            <div key={step.step} className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                        {step.step}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                                    <p className="text-gray-600 mt-1">{step.description}</p>
                                    <p className="text-sm text-gray-500 mt-1">Tiempo estimado: {step.time}</p>

                                    {step.guide && (
                                        <div className="mt-3">
                                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                {step.guide.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {step.url && (
                                        <a
                                            href={step.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            {step.action}
                                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Setup Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Configuración de WhatsApp Business
                </h2>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-800 font-medium">
                                ¡WhatsApp configurado exitosamente! Redirigiendo...
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
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Configurando...
                                </div>
                            ) : (
                                'Configurar WhatsApp'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Help Section */}
            {guide?.help && (
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">¿Necesitas ayuda?</h3>
                    <div className="space-y-4">
                        {guide.help.videos.map((video, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    {video.title} ({video.duration})
                                </a>
                            </div>
                        ))}
                        <p className="text-gray-600">{guide.help.support}</p>
                    </div>
                </div>
            )}
        </div>
    );
} 