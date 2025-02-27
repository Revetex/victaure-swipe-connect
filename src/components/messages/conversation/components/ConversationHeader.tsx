
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, MoreVertical, Phone, Video, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Receiver } from "@/types/messages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ConversationHeaderProps {
  receiver: Receiver | null;
  onBack: () => void;
}

export function ConversationHeader({ receiver, onBack }: ConversationHeaderProps) {
  const [showUserInfo, setShowUserInfo] = useState(false);
  const navigate = useNavigate();

  if (!receiver) {
    return (
      <div className="p-3 flex items-center justify-between border-b border-[#64B5D9]/10 bg-[#1B2A4A]/80">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5 text-[#F2EBE4]" />
        </Button>
        <div className="w-8 h-8 rounded-full bg-[#1A2335] animate-pulse" />
      </div>
    );
  }

  const viewProfile = () => {
    navigate(`/profile/${receiver.id}`);
  };

  const startVideoCall = () => {
    toast.info("Appel vidéo en cours de développement");
  };

  const startVoiceCall = () => {
    toast.info("Appel vocal en cours de développement");
  };

  const blockUser = () => {
    toast.info("Cette fonctionnalité est en cours de développement");
  };

  const reportConversation = () => {
    toast.info("Cette fonctionnalité est en cours de développement");
  };

  const deleteConversation = () => {
    toast.info("Cette fonctionnalité est en cours de développement");
  };

  return (
    <div className="relative">
      <div className="p-3 flex items-center justify-between border-b border-[#64B5D9]/10 bg-[#1B2A4A]/80">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-[#F2EBE4]">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowUserInfo(!showUserInfo)}>
            <Avatar className="h-9 w-9 border border-[#64B5D9]/30">
              <AvatarImage src={receiver.avatar_url || ""} />
              <AvatarFallback className="bg-[#1A2335] text-[#64B5D9]">
                {receiver.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h3 className="font-medium text-[#F2EBE4]">{receiver.full_name}</h3>
                {receiver.online_status === "online" && (
                  <Badge variant="outline" className="h-1.5 w-1.5 rounded-full bg-green-500 p-0 border-0" />
                )}
              </div>
              <span className="text-xs text-[#F2EBE4]/60">
                {receiver.online_status === "online"
                  ? "En ligne"
                  : receiver.last_seen
                  ? `Vu ${new Date(receiver.last_seen).toLocaleDateString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}`
                  : "Hors ligne"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-[#F2EBE4]/80 hover:text-[#F2EBE4] hidden sm:flex" onClick={startVoiceCall}>
            <Phone className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-[#F2EBE4]/80 hover:text-[#F2EBE4] hidden sm:flex" onClick={startVideoCall}>
            <Video className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#F2EBE4]/80 hover:text-[#F2EBE4]">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#242F44] border-[#64B5D9]/20 text-[#F2EBE4]">
              <DropdownMenuItem onClick={viewProfile} className="cursor-pointer hover:bg-[#1A2335]">
                <User className="mr-2 h-4 w-4" />
                <span>Voir le profil</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={startVoiceCall} className="cursor-pointer hover:bg-[#1A2335] sm:hidden">
                <Phone className="mr-2 h-4 w-4" />
                <span>Appel vocal</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={startVideoCall} className="cursor-pointer hover:bg-[#1A2335] sm:hidden">
                <Video className="mr-2 h-4 w-4" />
                <span>Appel vidéo</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-[#64B5D9]/10" />
              
              <DropdownMenuItem onClick={blockUser} className="cursor-pointer hover:bg-[#1A2335] text-amber-500">
                <span>Bloquer l'utilisateur</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={reportConversation} className="cursor-pointer hover:bg-[#1A2335] text-amber-500">
                <span>Signaler la conversation</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={deleteConversation} className="cursor-pointer hover:bg-[#1A2335] text-red-500">
                <span>Supprimer la conversation</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AnimatePresence>
        {showUserInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full z-20 bg-[#1A2335] border-b border-[#64B5D9]/10 shadow-md overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 border-2 border-[#64B5D9]/30">
                  <AvatarImage src={receiver.avatar_url || ""} />
                  <AvatarFallback className="bg-[#242F44] text-[#64B5D9]">
                    {receiver.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium text-lg text-[#F2EBE4]">{receiver.full_name}</h3>
                  <span className="text-sm text-[#F2EBE4]/60">{receiver.email}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className="text-xs bg-[#64B5D9]/10 text-[#64B5D9] border-[#64B5D9]/30 px-2">
                      {receiver.role}
                    </Badge>
                    {receiver.online_status === "online" && (
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/30 px-2">
                        En ligne
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {receiver.bio && (
                <p className="text-sm text-[#F2EBE4]/80 border-t border-[#64B5D9]/10 pt-3">
                  {receiver.bio}
                </p>
              )}
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" className="text-[#F2EBE4]/80" onClick={() => setShowUserInfo(false)}>
                  Fermer
                </Button>
                <Button className="bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-[#1E293B]" onClick={viewProfile}>
                  Voir profil complet
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
