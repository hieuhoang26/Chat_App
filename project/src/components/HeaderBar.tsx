import { Phone, Video, MoreVertical, ArrowLeft, Search } from 'lucide-react';
import UserAvatar from './UserAvatar';
import type { User } from '../types';

interface HeaderBarProps {
  user: User;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export default function HeaderBar({ user, onBackClick, showBackButton = false }: HeaderBarProps) {
  return (
    <header className="bg-chat-sidebar border-b border-chat-divider px-4 py-3 flex items-center gap-3">
      {showBackButton && (
        <button
          onClick={onBackClick}
          className="p-2 hover:bg-chat-hover rounded-lg transition-colors lg:hidden"
        >
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
      )}

      <UserAvatar user={user} size="md" showStatus />

      <div className="flex-1 min-w-0">
        <h2 className="text-base font-medium text-text-primary truncate">{user.name}</h2>
        <p className="text-sm text-text-secondary truncate">
          {user.status === 'online' ? 'online' : user.lastSeen ? `last seen ${user.lastSeen}` : 'offline'}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 hover:bg-chat-hover rounded-lg transition-colors">
          <Search className="w-5 h-5 text-text-primary" />
        </button>
        <button className="p-2 hover:bg-chat-hover rounded-lg transition-colors">
          <Phone className="w-5 h-5 text-text-primary" />
        </button>
        <button className="p-2 hover:bg-chat-hover rounded-lg transition-colors">
          <Video className="w-5 h-5 text-text-primary" />
        </button>
        <button className="p-2 hover:bg-chat-hover rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-text-primary" />
        </button>
      </div>
    </header>
  );
}
