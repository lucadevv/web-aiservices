// ===============================================
// FLOATING CHAT BUTTON - CEO AI PLATFORM
// ===============================================

'use client';

import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface FloatingChatButtonProps {
    onClick: () => void;
    isActive?: boolean;
    unreadCount?: number;
    isVisible?: boolean;
}

export default function FloatingChatButton({
    onClick,
    isActive = false,
    unreadCount = 0,
    isVisible = true
}: FloatingChatButtonProps) {
    if (!isVisible) return null;

    return (
        <button
            onClick={onClick}
            className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50 ${isActive
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50'
                } border-2 border-blue-600`}
            title="Chat con CEO AI"
        >
            <div className="relative">
                <ChatBubbleLeftRightIcon className="w-6 h-6 mx-auto" />

                {/* Badge de mensajes no leídos */}
                {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                )}
            </div>
        </button>
    );
} 