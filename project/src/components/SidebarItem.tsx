import { Pin, Volume2, VolumeX } from 'lucide-react';
import UserAvatar from './UserAvatar';
import type { Chat } from '../types';

interface SidebarItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export default function SidebarItem({ chat, isActive, onClick }: SidebarItemProps) {
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const truncateMessage = (text: string, maxLength: number = 35) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-chat-hover transition-colors ${
        isActive ? 'bg-chat-hover' : ''
      }`}
    >
      <UserAvatar user={chat.user} size="lg" showStatus />

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-medium text-text-primary truncate flex-1">
            {chat.user.name}
          </h3>
          <span className="text-xs text-text-secondary ml-2 flex-shrink-0">
            {formatTime(chat.lastMessage?.timestamp)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary truncate flex-1">
            {chat.lastMessage ? truncateMessage(chat.lastMessage.content) : 'No messages yet'}
          </p>

          <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
            {chat.isPinned && <Pin className="w-3.5 h-3.5 text-text-secondary fill-text-secondary" />}
            {chat.isMuted && <VolumeX className="w-3.5 h-3.5 text-text-secondary" />}
            {chat.unreadCount > 0 && (
              <span className="bg-accent-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
