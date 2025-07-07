'use client';
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowUp, Image, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VoiceRecorder } from "./VoiceRecorder";
import { UserProfile } from "./UserProfile";
import { ImageThumbnail } from "./ImageThumbnail";
import chatService from "@/services/chat-service";
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  query: string;
  isUser: boolean;
  timestamp: Date;
  type?: "text" | "image" | "voice";
  imageUrl?: string;
}

interface ChatInterfaceProps {
  onBack: () => void;
  keyId?: string;
}

export const ChatInterface = ({ onBack, keyId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {

        const response = await chatService.getMessages("Beetarts");
        const message = response.Message;

        const initialMessages: Message[] = [{
          id: uuidv4(),
          query: message,
          isUser: false,
          timestamp: new Date(),
        }];
        setMessages(initialMessages);
      } catch (error) {
        console.error("Error fetching initial messages:", error);
      }
    };

    fetchInitialMessages();
  }, []);

  const handleSendMessage = async (query: string, type: "text" | "image" | "voice" = "text", imageUrl?: string) => {
    if (!query.trim() && !imageUrl) return;

    
        const userMessage: Message = {
            id: uuidv4(),
            query,
            isUser: true,
            timestamp: new Date(),
            type,
            imageUrl,
        };



        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await chatService.sendMessage({ user_id: 1, query }).then((response) => {
                console.log("AI Response:", response);
                return response;
            });

            const aiMessage: Message = {
                id: uuidv4(),
                query: response.data,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error processing message:", error);
            const errorMessage: Message = {
                id: uuidv4(),
                query: "I apologize, but I'm having trouble processing your request right now. Please try again.",
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        }

        setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        handleSendMessage(`I've uploaded an image: ${file.name}`, "image", imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    handleSendMessage(transcript, "voice");
    setIsListening(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">

      <div className="max-w-4xl mx-auto px-4 py-8 flex gap-6 ">
        {/* Chat Area */}
        <div className="flex-1">
          {/* Messages */}
          <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <Card
                    className={`max-w-[80%] p-4 ${message.isUser
                        ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-white"
                        : "bg-gray-900/50 border-gray-700/50 text-gray-100"
                      }`}
                  >
                    {message.imageUrl && (
                      <div className="mb-3 max-w-xs">
                        <ImageThumbnail
                          src={message.imageUrl}
                          alt="Uploaded image"
                        />
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.query}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <Card className="bg-gray-900/50 border-gray-700/50 p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </Card>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="sticky bottom-0 bg-black/20 backdrop-blur-lg p-4 rounded-lg border border-cyan-500/20">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
              >
                <Image className="w-5 h-5" />
              </Button>

              <VoiceRecorder
                isListening={isListening}
                onToggle={() => setIsListening(!isListening)}
                onTranscript={handleVoiceTranscript}
              />

              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-500/50"
              />

              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white"
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* User Profile Sidebar */}
        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="w-80"
            >
              <UserProfile messages={messages} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
