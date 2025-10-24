import { Send, Paperclip, Smile, Mic } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import HeaderBar from './HeaderBar';
import MessageBubble from './MessageBubble';
import type { Chat, Message } from '../types';

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage?: (content: string) => void;
  onBackClick?: () => void;
}

export default function ChatWindow({ chat, messages, currentUserId, onSendMessage, onBackClick }: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() && onSendMessage) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      const date = new Date(message.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  if (!chat) {
    return (
      <div className="flex-1 bg-chat-window flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Send className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-text-primary mb-2">Welcome to Chatgram</h2>
          <p className="text-text-secondary max-w-md">
            Select a chat from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex-1 bg-chat-window flex flex-col">
      <HeaderBar user={chat.user} onBackClick={onBackClick} showBackButton />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <div key={date}>
            <div className="flex justify-center my-4">
              <span className="bg-chat-input text-text-secondary text-xs px-3 py-1 rounded-full">
                {date}
              </span>
            </div>
            {msgs.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
                senderName={message.senderId !== currentUserId ? chat.user.name : undefined}
              />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-chat-divider px-4 py-3">
        <div className="flex items-end gap-2">
          <button className="p-2 hover:bg-chat-hover rounded-lg transition-colors flex-shrink-0">
            <Paperclip className="w-5 h-5 text-text-secondary" />
          </button>

          <div className="flex-1 bg-chat-input rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-primary-600 transition-all">
            <textarea
              ref={inputRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full bg-transparent text-text-primary placeholder-text-secondary text-base resize-none outline-none max-h-32"
              rows={1}
              style={{
                minHeight: '24px',
                maxHeight: '128px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />
          </div>

          <button className="p-2 hover:bg-chat-hover rounded-lg transition-colors flex-shrink-0">
            <Smile className="w-5 h-5 text-text-secondary" />
          </button>

          {messageInput.trim() ? (
            <button
              onClick={handleSendMessage}
              className="p-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex-shrink-0"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button className="p-2 hover:bg-chat-hover rounded-lg transition-colors flex-shrink-0">
              <Mic className="w-5 h-5 text-text-secondary" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
