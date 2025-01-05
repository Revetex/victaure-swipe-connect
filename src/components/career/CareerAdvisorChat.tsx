import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { QuickSuggestions } from "./QuickSuggestions";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function CareerAdvisorChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { profile, setProfile } = useProfile();
  const { toast } = useToast();

  const handleSuggestionSelect = (suggestion: string) => {
    // Handle suggestion selection logic here
    setMessages((prev) => [...prev, { content: suggestion, sender: "user" }]);
  };

  const handleMessageSubmit = async (message: string) => {
    // Handle message submission logic here
    setMessages((prev) => [...prev, { content: message, sender: "user" }]);
  };

  const handleProfileUpdate = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile?.full_name,
          role: profile?.role,
          bio: profile?.bio
        })
        .eq('id', profile?.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Mon Profil</h3>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-white"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleProfileUpdate}
                  className="text-green-500 hover:text-green-400"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Nom complet</label>
              {isEditing ? (
                <Input
                  value={profile?.full_name || ""}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="bg-gray-700/50 border-gray-600"
                  placeholder="Votre nom complet"
                />
              ) : (
                <p className="text-gray-200">{profile?.full_name || "Non défini"}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Rôle</label>
              {isEditing ? (
                <Input
                  value={profile?.role || ""}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="bg-gray-700/50 border-gray-600"
                  placeholder="Votre rôle professionnel"
                />
              ) : (
                <p className="text-gray-200">{profile?.role || "Non défini"}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Bio</label>
              {isEditing ? (
                <Textarea
                  value={profile?.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="bg-gray-700/50 border-gray-600"
                  placeholder="Décrivez votre parcours professionnel"
                />
              ) : (
                <p className="text-gray-200">{profile?.bio || "Non défini"}</p>
              )}
            </div>
          </div>
        </motion.div>

        <QuickSuggestions onSelect={handleSuggestionSelect} />

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-600/20 ml-auto"
                  : "bg-gray-800/50"
              } max-w-[80%] mb-4`}
            >
              <p className="text-gray-200">{message.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-gray-400"
          >
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800">
        <ChatInput onSubmit={handleMessageSubmit} />
      </div>
    </div>
  );
}
