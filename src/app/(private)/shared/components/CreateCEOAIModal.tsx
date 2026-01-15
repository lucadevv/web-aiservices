'use client';

import { useState } from 'react';
import { XMarkIcon, BuildingOfficeIcon, UserIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface CreateCEOAIModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateCEOAIData) => Promise<void>;
    isLoading?: boolean;
}

export interface CreateCEOAIData {
    name: string;
    company_name: string;
    industry: string;
    description: string;
    personality: string;
}

export default function CreateCEOAIModal({ isOpen, onClose, onSubmit, isLoading = false }: CreateCEOAIModalProps) {
    const [formData, setFormData] = useState<CreateCEOAIData>({
        name: '',
        company_name: '',
        industry: '',
        description: '',
        personality: ''
    });
    const [errors, setErrors] = useState<Partial<CreateCEOAIData>>({});

    const industries = [
        'Technology',
        'Marketing',
        'Finance',
        'Healthcare',
        'Education',
        'E-commerce',
        'Real Estate',
        'Consulting',
        'Manufacturing',
        'Other'
    ];

    const personalities = [
        'Professional and formal',
        'Friendly and approachable',
        'Creative and innovative',
        'Analytical and data-driven',
        'Energetic and enthusiastic',
        'Calm and composed',
        'Direct and straightforward',
        'Collaborative and team-oriented'
    ];

    const validateForm = (): boolean => {
        const newErrors: Partial<CreateCEOAIData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del CEO AI es requerido';
        } else if (formData.name.length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres';
        }

        if (!formData.company_name.trim()) {
            newErrors.company_name = 'El nombre de la empresa es requerido';
        }

        if (!formData.industry.trim()) {
            newErrors.industry = 'La industria es requerida';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es requerida';
        } else if (formData.description.length < 10) {
            newErrors.description = 'La descripción debe tener al menos 10 caracteres';
        }

        if (!formData.personality.trim()) {
            newErrors.personality = 'La personalidad es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
            handleClose();
        } catch (error) {
            console.error('Error creating CEO AI:', error);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            company_name: '',
            industry: '',
            description: '',
            personality: ''
        });
        setErrors({});
        onClose();
    };

    const handleInputChange = (field: keyof CreateCEOAIData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose}></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo CEO AI</h2>
                                <p className="text-sm text-gray-500">Configura tu asistente ejecutivo personalizado</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del CEO AI *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Ej: TechCorp AI"
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Company Name */}
                        <div>
                            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de la Empresa *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="company_name"
                                    value={formData.company_name}
                                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.company_name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Ej: TechCorp Solutions"
                                />
                            </div>
                            {errors.company_name && (
                                <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
                            )}
                        </div>

                        {/* Industry */}
                        <div>
                            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                                Industria *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    id="industry"
                                    value={formData.industry}
                                    onChange={(e) => handleInputChange('industry', e.target.value)}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.industry ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Selecciona una industria</option>
                                    {industries.map((industry) => (
                                        <option key={industry} value={industry}>
                                            {industry}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.industry && (
                                <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción *
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.description ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Describe el propósito y funciones principales de tu CEO AI..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        {/* Personality */}
                        <div>
                            <label htmlFor="personality" className="block text-sm font-medium text-gray-700 mb-2">
                                Personalidad *
                            </label>
                            <div className="relative">
                                <select
                                    id="personality"
                                    value={formData.personality}
                                    onChange={(e) => handleInputChange('personality', e.target.value)}
                                    className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.personality ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Selecciona una personalidad</option>
                                    {personalities.map((personality) => (
                                        <option key={personality} value={personality}>
                                            {personality}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.personality && (
                                <p className="mt-1 text-sm text-red-600">{errors.personality}</p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Creando...
                                    </div>
                                ) : (
                                    'Crear CEO AI'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 