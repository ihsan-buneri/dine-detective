
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MessageSquare,
  Plus,
  Settings,
  Trash2,
  MoreHorizontal,
  User,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onShowSettings: () => void;
}

export const ChatSidebar = ({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onShowSettings
}: ChatSidebarProps) => {
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const router = useRouter();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Agora mesmo";
    if (diffInHours < 24) return `${diffInHours}h atrás`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;

    return date.toLocaleDateString('pt-PT');
  };

  const handleLogout = () => {
    // Implement logout functionality
    router.push('/')
    localStorage.removeItem('keyId');
  };

  return (
    <div className="w-80 bg-black/20 backdrop-blur-lg border-r border-cyan-500/20 flex overflow-y-scroll h-screen flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-medium">Profile</span>
          </div>
          <div className="flex gap-x-1 items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowSettings}
              className="text-gray-400 cursor-pointer hover:text-cyan-400 hover:bg-cyan-500/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
              <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout             }
              className="text-gray-400 cursor-pointer hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r cursor-pointer from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 hover:from-cyan-500/30 hover:to-purple-500/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          <AnimatePresence>
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
              >
                <Card
                  className={`p-3 cursor-pointer transition-all duration-200 ${selectedChatId === chat.id
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30"
                      : "bg-gray-900/30 border-gray-700/30 hover:bg-gray-800/50 hover:border-gray-600/50"
                    }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <MessageSquare className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <h3 className="text-sm font-medium text-white truncate">
                          {chat.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 truncate mb-2">
                        {chat.lastMessage}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatTime(chat.timestamp)}</span>
                        <span>{chat.messageCount} mensagens</span>
                      </div>
                    </div>

                    {hoveredChatId === chat.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 text-gray-400 hover:text-red-400 h-6 w-6 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-900 border-gray-700">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChat(chat.id);
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {chats.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
             No conversation yet
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Click "New Conversation" to start
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
