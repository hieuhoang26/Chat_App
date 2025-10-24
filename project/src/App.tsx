import { useState } from 'react';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Settings from './pages/Settings';
import { useChatState } from './hooks/useChatState';
import { mockChats, mockMessages, currentUser } from './utils/mockData';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user, loading } = useAuth();
  const [chats] = useState(mockChats);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const { activeChat, messages, setActiveChat, sendMessage } = useChatState(chats);

  const [allMessages, setAllMessages] = useState(mockMessages);

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = (content: string) => {
    if (activeChat) {
      const newMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        chatId: activeChat,
        senderId: currentUser.id,
        content,
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setAllMessages((prev) => [...prev, newMessage]);
    }
  };

  const handleBackClick = () => {
    setIsSidebarOpen(true);
    setActiveChat(null);
  };

  const activeChatData = chats.find((c) => c.id === activeChat) || null;
  const currentMessages = activeChat ? allMessages.filter((m) => m.chatId === activeChat) : [];

  if (loading) {
    return (
      <div className="h-screen bg-chat-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center animate-pulse">
            <span className="text-2xl font-bold text-white">C</span>
          </div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'login') {
      return <Login onSwitchToSignUp={() => setAuthView('signup')} />;
    } else {
      return <SignUp onSwitchToLogin={() => setAuthView('login')} />;
    }
  }

  if (showSettings) {
    return <Settings onClose={() => setShowSettings(false)} />;
  }

  return (
    <div className="h-screen bg-chat-bg flex overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onChatSelect={handleChatSelect}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onSettingsClick={() => setShowSettings(true)}
        isOpen={isSidebarOpen}
      />

      <div className={`flex-1 ${!activeChat && !isSidebarOpen ? 'block' : activeChat ? 'block' : 'hidden lg:block'}`}>
        <ChatWindow
          chat={activeChatData}
          messages={currentMessages}
          currentUserId={currentUser.id}
          onSendMessage={handleSendMessage}
          onBackClick={handleBackClick}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
