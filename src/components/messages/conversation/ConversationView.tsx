
import { useReceiver } from "@/hooks/useReceiver";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ConversationHeader } from "./components/ConversationHeader";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { useMessages } from "./hooks/useMessages";
import type { Receiver, UserRole } from "@/types/messages";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Image, Mic, Plus, X, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmojiPicker } from "../emoji/EmojiPicker";
import { useIsMobile } from "@/hooks/use-mobile";
import { useThemeContext } from "@/components/ThemeProvider";

export function ConversationView() {
  const { receiver, setReceiver, setShowConversation } = useReceiver();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, handleDeleteMessage, setMessages } = useMessages(receiver);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const isMobile = useIsMobile();
  const { isDark } = useThemeContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const receiverId = searchParams.get('receiver');
    if (receiverId && !receiver) {
      loadUserProfile(receiverId);
    }
  }, [searchParams, receiver]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages]);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log("Loading user profile for ID:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          certifications (*),
          education (*),
          experiences (*)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
        throw error;
      }
      
      if (profile) {
        console.log("Profile loaded successfully:", profile);
        const validRoles: UserRole[] = ['professional', 'business', 'admin'];
        const userRole: UserRole = validRoles.includes(profile.role as UserRole) 
          ? (profile.role as UserRole)
          : 'professional';

        setReceiver({
          id: profile.id,
          full_name: profile.full_name || '',
          avatar_url: profile.avatar_url,
          email: profile.email,
          role: userRole,
          bio: profile.bio,
          phone: profile.phone,
          city: profile.city,
          state: profile.state,
          country: profile.country || '',
          skills: profile.skills || [],
          latitude: profile.latitude,
          longitude: profile.longitude,
          online_status: profile.online_status ? 'online' : 'offline',
          last_seen: profile.last_seen,
          certifications: profile.certifications || [],
          education: profile.education || [],
          experiences: profile.experiences || [],
          friends: []
        });
        setShowConversation(true);
      } else {
        console.error("No profile found for user ID:", userId);
        toast.error("Profil introuvable");
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error("Impossible de charger le profil");
    }
  };

  const handleBack = () => {
    setShowConversation(false);
    navigate('/messages');
  };

  const handleStartRecording = () => {
    // Implement voice recording functionality
    setIsRecording(true);
    toast.info("Enregistrement vocal démarré");
    // In a real implementation, you would use the Web Audio API here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast.success("Enregistrement vocal terminé");
    // In a real implementation, you would stop recording and process the audio here
  };

  const handleAddEmoji = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setIsUploading(true);
      // For demo purposes, we'll just simulate file upload
      setTimeout(() => {
        setIsUploading(false);
        toast.success("Fichier téléchargé avec succès");
        // In a real implementation, you would upload the file to storage here
      }, 1500);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Erreur lors du téléchargement du fichier");
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user || !receiver) return;

    try {
      console.log("Sending message to:", receiver.id);
      // Obtenir ou créer une conversation entre les deux utilisateurs
      const { data: conversationData, error: conversationError } = await supabase
        .from('user_conversations')
        .select('id')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${receiver.id}),and(participant1_id.eq.${receiver.id},participant2_id.eq.${user.id})`)
        .single();

      // Si aucune conversation n'existe, la créer
      let conversationId: string;
      if (conversationError || !conversationData) {
        console.log("Creating new conversation");
        // Déterminer l'ordre des participants pour la contrainte d'unicité
        const [participant1_id, participant2_id] = 
          user.id < receiver.id 
            ? [user.id, receiver.id] 
            : [receiver.id, user.id];
        
        const { data: newConversation, error: createError } = await supabase
          .from('user_conversations')
          .insert({
            participant1_id,
            participant2_id
          })
          .select('id')
          .single();
          
        if (createError) {
          console.error("Error creating conversation:", createError);
          throw createError;
        }
        conversationId = newConversation.id;
        console.log("New conversation created with ID:", conversationId);
      } else {
        conversationId = conversationData.id;
        console.log("Using existing conversation with ID:", conversationId);
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          content: messageInput,
          sender_id: user.id,
          receiver_id: receiver.id,
          conversation_id: conversationId,
          metadata: {},
          status: 'sent'
        });

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }
      
      setMessageInput("");
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      toast.success("Message envoyé");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Impossible d'envoyer le message");
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "flex flex-col h-full relative",
          isDark 
            ? "bg-gradient-to-b from-[#1B2A4A]/50 to-[#1A1F2C]/50" 
            : "bg-gradient-to-b from-white to-[#F1F0FB]/50"
        )}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ConversationHeader 
            receiver={receiver}
            onBack={handleBack}
          />
        </motion.div>
        
        <motion.div 
          className="flex-1 overflow-y-auto p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MessageList
            messages={messages}
            currentUserId={user?.id}
            onDeleteMessage={handleDeleteMessage}
            messagesEndRef={messagesEndRef}
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10"
        >
          {showEmojiPicker && (
            <div className={cn(
              "absolute bottom-full mb-2 z-50",
              isMobile ? "left-0 right-0 mx-auto w-[90%]" : "left-0"
            )}>
              <EmojiPicker onEmojiSelect={handleAddEmoji} onClose={() => setShowEmojiPicker(false)} />
            </div>
          )}
          
          {showAttachMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                "absolute bottom-full mb-2 z-40 rounded-lg shadow-xl p-3",
                "border",
                isDark 
                  ? "bg-[#242F44] border-[#64B5D9]/20" 
                  : "bg-white border-slate-200",
                isMobile ? "left-2 right-2" : "left-4"
              )}
            >
              <div className="flex items-center justify-around gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "rounded-full",
                    isDark
                      ? "bg-[#1A2335]/80 hover:bg-[#1A2335] text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "rounded-full",
                    isDark
                      ? "bg-[#1A2335]/80 hover:bg-[#1A2335] text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  )}
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowAttachMenu(false);
                  }}
                >
                  <Image className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "rounded-full",
                    isDark
                      ? "bg-[#1A2335]/80 hover:bg-[#1A2335] text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  )}
                  onClick={() => {
                    setShowAttachMenu(false);
                    handleStartRecording();
                  }}
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "rounded-full",
                    isDark
                      ? "bg-[#1A2335]/80 hover:bg-[#1A2335] text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  )}
                  onClick={() => setShowAttachMenu(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleUploadFile}
            accept="image/*,application/pdf,video/*,audio/*"
          />
          
          <div className={cn(
            "p-2 sm:p-4 border-t",
            isDark 
              ? "bg-[#1B2A4A]/50 border-[#64B5D9]/10" 
              : "bg-white/60 border-slate-200",
            isRecording && isDark && "bg-[#1B2A4A]/80",
            isRecording && !isDark && "bg-slate-100/80"
          )}>
            <div className={cn(
              "flex items-end gap-2 p-2 rounded-lg border",
              "transition-all duration-300",
              isDark 
                ? "bg-[#1A1F2C]/50 backdrop-blur-sm border-[#64B5D9]/10" 
                : "bg-white backdrop-blur-sm border-slate-200"
            )}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors h-9 w-9 rounded-full",
                  isDark 
                    ? "text-[#F2EBE4]/80 hover:text-[#F2EBE4] hover:bg-[#1A2335]/80" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
                onClick={() => setShowAttachMenu(!showAttachMenu)}
              >
                <Plus className="h-5 w-5" />
              </Button>
              
              {isRecording ? (
                <div className="flex-1 flex items-center gap-3 px-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className={isDark ? "text-white/80" : "text-slate-700"}>
                    Enregistrement en cours...
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "ml-auto",
                      isDark 
                        ? "text-white/80 hover:text-white" 
                        : "text-slate-600 hover:text-slate-900"
                    )}
                    onClick={handleStopRecording}
                  >
                    Arrêter
                  </Button>
                </div>
              ) : (
                <>
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Écrivez votre message..."
                    className={cn(
                      "flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0",
                      isDark 
                        ? "bg-transparent text-[#F2EBE4] placeholder-[#F2EBE4]/30" 
                        : "bg-transparent text-slate-900 placeholder-slate-400"
                    )}
                  />
                
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "transition-colors h-9 w-9 rounded-full",
                      isDark 
                        ? "text-[#F2EBE4]/80 hover:text-[#F2EBE4] hover:bg-[#1A2335]/80" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                </>
              )}

              <Button
                onClick={isRecording ? handleStopRecording : handleSendMessage}
                disabled={isRecording ? false : !messageInput.trim()}
                className={cn(
                  "h-9 w-9 rounded-full",
                  "transition-all duration-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isDark 
                    ? "bg-[#64B5D9] hover:bg-[#64B5D9]/80 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                )}
              >
                {isRecording ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
