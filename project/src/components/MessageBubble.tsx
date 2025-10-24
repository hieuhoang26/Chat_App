import { Check, CheckCheck } from 'lucide-react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  senderName?: string;
}

export default function MessageBubble({ message, isOwn, showAvatar = false, senderName }: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className={`flex gap-2 mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && showAvatar && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex-shrink-0" />
      )}
      <div className={`flex flex-col max-w-[65%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && senderName && (
          <span className="text-xs text-text-link font-medium mb-1 px-3">{senderName}</span>
        )}
        <div
          className={`px-4 py-2.5 rounded-bubble ${
            isOwn
              ? 'bg-chat-bubble-own text-text-primary'
              : 'bg-chat-bubble-other text-text-primary'
          } shadow-sm`}
        >
          <p className="text-base leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
          <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-text-secondary">{formatTime(message.timestamp)}</span>
            {isOwn && (
              <span className="text-text-secondary">
                {message.isRead ? (
                  <CheckCheck className="w-3.5 h-3.5 text-accent-400" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
