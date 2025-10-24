import { Menu, Settings, Plus } from 'lucide-react';
import { useState } from 'react';
import SearchInput from './SearchInput';
import SidebarItem from './SidebarItem';
import type { Chat } from '../types';

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  isOpen?: boolean;
}

export default function ChatSidebar({ chats, activeChat, onChatSelect, onMenuClick, onSettingsClick, isOpen = true }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    const aTime = a.lastMessage?.timestamp || '0';
    const bTime = b.lastMessage?.timestamp || '0';
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return (
    <aside
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-40 w-full sm:w-88 lg:w-100 bg-chat-sidebar border-r border-chat-divider flex flex-col transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-chat-divider">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-chat-hover rounded-lg transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-text-primary" />
        </button>

        <h1 className="text-xl font-semibold text-text-primary flex-1 lg:flex-none lg:mx-0 mx-auto">
          Chatgram
        </h1>

        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-chat-hover rounded-lg transition-colors">
            <Plus className="w-5 h-5 text-text-primary" />
          </button>
          <button onClick={onSettingsClick} className="p-2 hover:bg-chat-hover rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-text-primary" />
          </button>
        </div>
      </div>

      <div className="px-3 py-3 border-b border-chat-divider">
        <SearchInput
          placeholder="Search chats"
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <p className="text-text-secondary text-sm">
              {searchQuery ? 'No chats found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          sortedChats.map((chat) => (
            <SidebarItem
              key={chat.id}
              chat={chat}
              isActive={activeChat === chat.id}
              onClick={() => onChatSelect(chat.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
