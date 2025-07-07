
'use client';
import { useEffect, useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { UserSettings } from "@/components/UserSettings";
import { motion } from "framer-motion";
import { ChatInterface } from "@/components/ChatInterface";
import { v4 as uuidv4 } from 'uuid';
import localStorageService from "@/services/localstorage-service";

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

const Profile = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  const handleNewChat = () => {
    const keyId= uuidv4();
    const newChat: Chat = {
      id: keyId,
      title: keyId,
      lastMessage: "Conversa iniciada...",
      timestamp: new Date(),
      messageCount: 0
    };

    localStorageService.setItem(`keyId`, keyId);

    setChats(prev => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
  };

  useEffect(() => {
    const hasActiveChat = localStorageService.getItem('keyId');
    if (hasActiveChat) {
      setSelectedChatId(hasActiveChat);
    }
  }, []);

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (selectedChatId === chatId) {
      setSelectedChatId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex overflow-y-hidden">
      {/* Sidebar with chats */}
      <ChatSidebar 
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onShowSettings={() => setShowSettings(true)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {selectedChatId ? (
          <motion.div
            key={selectedChatId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {<ChatInterface 
              onBack={() => setSelectedChatId(null)}
              keyId={selectedChat?.id}
            />}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">SN</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to Sarah Nexus
              </h2>
              <p className="text-gray-400 mb-6">
               Select a conversation or start a new one to get started
              </p>
              <button
                onClick={handleNewChat}
                className="bg-gradient-to-r cursor-pointer from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                New Conversation
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* User Settings Modal */}
      {showSettings && (
        <UserSettings 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default Profile;
