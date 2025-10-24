import { useState, useCallback } from 'react';
import type { Chat, Message } from '../types';

interface UseChatStateReturn {
  activeChat: string | null;
  messages: Message[];
  setActiveChat: (chatId: string | null) => void;
  sendMessage: (chatId: string, content: string, senderId: string) => void;
  getMessagesForChat: (chatId: string) => Message[];
}

export function useChatState(initialChats: Chat[]): UseChatStateReturn {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  const getMessagesForChat = useCallback(
    (chatId: string) => {
      return allMessages.filter((msg) => msg.chatId === chatId);
    },
    [allMessages]
  );

  const sendMessage = useCallback((chatId: string, content: string, senderId: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      chatId,
      senderId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setAllMessages((prev) => [...prev, newMessage]);
  }, []);

  const messages = activeChat ? getMessagesForChat(activeChat) : [];

  return {
    activeChat,
    messages,
    setActiveChat,
    sendMessage,
    getMessagesForChat,
  };
}
