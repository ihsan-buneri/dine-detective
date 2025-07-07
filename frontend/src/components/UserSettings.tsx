
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { User, Mail, Settings, Save } from "lucide-react";
import { motion } from "framer-motion";

interface UserSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSettings = ({ isOpen, onClose }: UserSettingsProps) => {
  const [userdata, setUserdata] = useState({
    name: "João Silva",
    email: "joao.silva@example.com",
    preferences: {
      language: "pt-PT",
      theme: "dark",
      notifications: true
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userdata);

  const handleSave = () => {
    setUserdata(formData);
    setIsEditing(false);
    // Aqui integraria com o backend para salvar os dados
    console.log("Dados salvos:", formData);
  };

  const handleCancel = () => {
    setFormData(userdata);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-cyan-400">
            <Settings className="w-5 h-5" />
            <span>User Settings</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Manage your personal data and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Profile Section */}
          <Card className="bg-gray-800/50 border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-400" />
                <span>Profile</span>
              </h3>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-cyan-400 cursor-pointer hover:text-cyan-300 hover:bg-cyan-500/10"
                >
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-gray-700/50 border-gray-600/50 text-white disabled:opacity-60"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-300">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-gray-700/50 border-gray-600/50 text-white disabled:opacity-60"
                />
              </div>
            </div>

            {isEditing && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex space-x-3 mt-4 pt-4 border-t border-gray-700/50"
              >
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r cursor-pointer from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  className="text-gray-400 cursor-pointer hover:text-gray-300 hover:bg-gray-700/50"
                >
                  Cancel
                </Button>
              </motion.div>
            )}
          </Card>
          {/* Statistics Section */}
          <Card className="bg-gray-800/50 border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyan-500/10 p-4 rounded-lg border border-cyan-500/20">
                <div className="text-2xl font-bold text-cyan-400">47</div>
                <div className="text-sm text-gray-400">Total Conversations</div>
              </div>
              <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400">1,234</div>
                <div className="text-sm text-gray-400">Messages Sent</div>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
