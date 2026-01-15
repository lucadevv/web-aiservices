// ===============================================
// CHAT MODAL - CEO AI PLATFORM
// ===============================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import type { ChatMessage } from '../models/chat.model';
import {
    PaperAirplaneIcon,
    TrashIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    ceoAIId: string;
    ceoAIName: string;
    onMinimizeChange?: (isMinimized: boolean) => void;
}

export default function ChatModal({
    isOpen,
    onClose,
    ceoAIId,
    ceoAIName,
    onMinimizeChange
}: ChatModalProps) {
    const [inputMessage, setInputMessage] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const {
        messages,
        isLoading,
        error,
        isTyping,
        sendMessage,
        clearChat,
        clearError
    } = useChat(ceoAIId);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (isOpen && !isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isMinimized]);

    // Auto-focus en el input
    useEffect(() => {
        if (isOpen && !isMinimized && !isTyping) {
            inputRef.current?.focus();
        }
    }, [isOpen, isMinimized, isTyping]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || isTyping) return;

        const message = inputMessage;
        setInputMessage('');
        await sendMessage(message);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Modal fijo - sin overlay que cierre, tipo Flutter Stack */}
            <div className={`fixed bottom-6 right-6 transition-all duration-300 shadow-2xl rounded-lg border border-gray-200 flex flex-col bg-white ${isMinimized
                    ? 'w-48 h-8 z-[10000]'
                    : 'w-96 h-[500px] z-[9999]'
                }`}>

                {/* Header */}
                <div className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg flex items-center justify-between flex-shrink-0 ${isMinimized ? 'p-1' : 'p-4'
                    }`}>
                    <div className={`flex items-center space-x-3 ${isMinimized ? 'space-x-1' : ''}`}>
                        <div className={`bg-white bg-opacity-20 rounded-full flex items-center justify-center ${isMinimized ? 'w-6 h-6' : 'w-10 h-10'
                            }`}>
                            <span className={`font-semibold ${isMinimized ? 'text-xs' : 'text-sm'
                                }`}>
                                {ceoAIName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        {!isMinimized && (
                            <div>
                                <h3 className="font-semibold text-base">{ceoAIName}</h3>
                                <p className="text-xs text-blue-100">CEO AI Assistant</p>
                            </div>
                        )}
                        {isMinimized && (
                            <div>
                                <h3 className="font-semibold text-xs">{ceoAIName}</h3>
                            </div>
                        )}
                    </div>
                    <div className={`flex items-center space-x-2 ${isMinimized ? 'space-x-1' : ''}`}>
                        <button
                            onClick={() => {
                                const newMinimizedState = !isMinimized;
                                setIsMinimized(newMinimizedState);
                                onMinimizeChange?.(newMinimizedState);
                            }}
                            className={`hover:bg-white hover:bg-opacity-20 rounded-full transition-colors ${isMinimized ? 'p-1' : 'p-2'
                                }`}
                            title={isMinimized ? "Maximizar" : "Minimizar"}
                        >
                            <ChevronDownIcon className={`transition-transform ${isMinimized ? 'w-3 h-3' : 'w-4 h-4'
                                } ${isMinimized ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                            onClick={onClose}
                            className={`hover:bg-white hover:bg-opacity-20 rounded-full transition-colors ${isMinimized ? 'p-1' : 'p-2'
                                }`}
                            title="Cerrar"
                        >
                            <XMarkIcon className={`${isMinimized ? 'w-3 h-3' : 'w-4 h-4'
                                }`} />
                        </button>
                    </div>
                </div>

                {/* Chat Content */}
                {!isMinimized && (
                    <>
                        {/* Messages Container */}
                        <div className="bg-white flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.length === 0 && !isLoading && (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                        <span className="text-blue-600 text-xl">💬</span>
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                                        ¡Hola! Soy {ceoAIName}
                                    </h3>
                                    <p className="text-xs text-gray-600 max-w-xs mx-auto">
                                        Estoy aquí para ayudarte con cualquier consulta sobre tu negocio.
                                    </p>
                                </div>
                            )}

                            {messages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    formatTime={formatTime}
                                />
                            ))}

                            {isTyping && (
                                <div className="flex items-center space-x-2 text-gray-500 bg-gray-50 rounded-lg p-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span className="text-xs font-medium">{ceoAIName} está escribiendo...</span>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mx-4 mb-3 bg-red-50 border border-red-200 rounded-lg p-2 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <ExclamationTriangleIcon className="w-3 h-3 text-red-500" />
                                        <span className="text-xs text-red-700 font-medium">{error}</span>
                                    </div>
                                    <button
                                        onClick={clearError}
                                        className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100"
                                    >
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Input Form - PEGADO AL BOTTOM */}
                        <div className="bg-gray-50 p-3 border-t border-gray-200 rounded-b-lg flex-shrink-0">
                            <form onSubmit={handleSubmit} className="flex space-x-2">
                                <div className="flex-1 relative">
                                    <textarea
                                        ref={inputRef}
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Escribe tu mensaje..."
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-sm"
                                        rows={1}
                                        disabled={isTyping}
                                        style={{ minHeight: '40px', maxHeight: '80px' }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!inputMessage.trim() || isTyping}
                                    className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <PaperAirplaneIcon className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

// Componente para cada mensaje
function MessageBubble({
    message,
    formatTime
}: {
    message: ChatMessage;
    formatTime: (timestamp: string) => string;
}) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-sm ${isUser
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                : 'bg-gray-100 text-gray-900 border border-gray-200'
                }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 opacity-70 ${isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                    {formatTime(message.timestamp)}
                </p>
            </div>
        </div>
    );
} 