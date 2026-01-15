// ===============================================
// ADD AGENT MODAL COMPONENT - FRONTEND
// ===============================================

'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { CreateAgentData } from '../models/ceo-ai.model';

interface AddAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateAgentData) => Promise<void>;
    isLoading: boolean;
}

export default function AddAgentModal({ isOpen, onClose, onSubmit, isLoading }: AddAgentModalProps) {
    const [formData, setFormData] = useState<CreateAgentData>({
        name: '',
        type: '',
        description: '',
        specialization: '',
        personality: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.type || !formData.description || !formData.specialization || !formData.personality) {
            alert('Por favor completa todos los campos');
            return;
        }

        try {
            await onSubmit(formData);
            setFormData({
                name: '',
                type: '',
                description: '',
                specialization: '',
                personality: ''
            });
            onClose();
        } catch (error) {
            console.error('Error creating agent:', error);
        }
    };

    const handleInputChange = (field: keyof CreateAgentData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Agregar Agente</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Agente
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Agente de Ventas"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Agente
                        </label>
                        <select
                            id="type"
                            value={formData.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isLoading}
                        >
                            <option value="">Selecciona un tipo</option>
                            <option value="toolsAgent">Tools Agent</option>
                            <option value="conversationalAgent">Conversational Agent</option>
                            <option value="openAIFunctionsAgent">OpenAI Functions Agent</option>
                            <option value="planAndExecuteAgent">Plan and Execute Agent</option>
                            <option value="reActAgent">ReAct Agent</option>
                            <option value="sqlAgent">SQL Agent</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Describe las funciones principales del agente"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                            Especialización
                        </label>
                        <input
                            type="text"
                            id="specialization"
                            value={formData.specialization}
                            onChange={(e) => handleInputChange('specialization', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Ventas B2B, Atención al Cliente"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="personality" className="block text-sm font-medium text-gray-700 mb-1">
                            Personalidad
                        </label>
                        <textarea
                            id="personality"
                            value={formData.personality}
                            onChange={(e) => handleInputChange('personality', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Describe cómo debe comportarse el agente (amigable, profesional, etc.)"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creando...
                                </div>
                            ) : (
                                'Crear Agente'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 