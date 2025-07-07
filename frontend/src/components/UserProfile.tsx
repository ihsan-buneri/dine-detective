
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Heart, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  query: string;
  isUser: boolean;
  timestamp: Date;
  type?: "text" | "image" | "voice";
}

interface UserProfileProps {
  messages: Message[];
}

export const UserProfile = ({ messages }: UserProfileProps) => {
  // Analyze messages to build user profile
  const userMessages = messages.filter(m => m.isUser);
  const interests = extractInterests(userMessages);
  const preferences = extractPreferences(userMessages);
  const recentActivity = userMessages.slice(-5).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <Card className="bg-gray-900/50 border-gray-700/50 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Your Profile</h3>
            <p className="text-sm text-gray-400">AI-Generated Knowledge Graph</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Interests */}
          {interests.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-medium text-gray-300">Interests</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-pink-500/20 text-pink-300 border-pink-500/30"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Preferences */}
          {preferences.location && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-gray-300">Location</span>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                {preferences.location}
              </Badge>
            </div>
          )}

          {/* Activity Stats */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Activity</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-purple-500/10 p-2 rounded">
                <div className="text-purple-300 font-medium">{userMessages.length}</div>
                <div className="text-gray-400 text-xs">Messages</div>
              </div>
              <div className="bg-cyan-500/10 p-2 rounded">
                <div className="text-cyan-300 font-medium">{interests.length}</div>
                <div className="text-gray-400 text-xs">Interests</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card className="bg-gray-900/50 border-gray-700/50 p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Recent Activity</h4>
          <div className="space-y-2">
            {recentActivity.map((message) => (
              <div
                key={message.id}
                className="text-xs text-gray-400 p-2 bg-gray-800/30 rounded"
              >
                <div className="truncate">{message.query}</div>
                <div className="text-gray-500 text-xs mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
};

function extractInterests(messages: Message[]): string[] {
  const interests = new Set<string>();
  const keywords = {
    food: ['food', 'restaurant', 'eat', 'cuisine', 'meal', 'hungry'],
    travel: ['travel', 'flight', 'hotel', 'vacation', 'trip'],
    shopping: ['buy', 'shop', 'purchase', 'product', 'store'],
    technology: ['tech', 'ai', 'computer', 'software', 'app'],
    entertainment: ['movie', 'music', 'game', 'book', 'show'],
  };

  messages.forEach(message => {
    const query = message.query.toLowerCase();
    Object.entries(keywords).forEach(([category, words]) => {
      if (words.some(word => query.includes(word))) {
        interests.add(category);
      }
    });
  });

  return Array.from(interests);
}

function extractPreferences(messages: Message[]): { location?: string } {
  const preferences: { location?: string } = {};
  
  messages.forEach(message => {
    // Extract location mentions
    const locationMatch = message.query.match(/(in|at|near) ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/);
    if (locationMatch) {
      preferences.location = locationMatch[2];
    }
  });

  return preferences;
}
