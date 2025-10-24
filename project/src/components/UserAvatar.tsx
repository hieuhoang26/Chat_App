import { User } from 'lucide-react';
import type { User as UserType } from '../types';

interface UserAvatarProps {
  user: Pick<UserType, 'name' | 'avatar' | 'status'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const statusSizes = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
};

const statusColors = {
  online: 'bg-accent-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-600',
};

export default function UserAvatar({ user, size = 'md', showStatus = false }: UserAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative inline-block">
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium overflow-hidden flex-shrink-0`}
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(user.name)}</span>
        )}
      </div>
      {showStatus && user.status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} ${
            statusColors[user.status]
          } rounded-full border-2 border-chat-sidebar`}
        />
      )}
    </div>
  );
}
