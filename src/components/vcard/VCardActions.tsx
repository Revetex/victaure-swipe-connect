import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, Download, FileText, CreditCard, MessageSquare, Share2 } from "lucide-react";
import { CareerAdvisorChat } from "../career/CareerAdvisorChat";
import { useState } from "react";
import { Message } from "@/types/chat/messageTypes";
import { useChat } from "@/hooks/useChat";

interface VCardActionsProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  profile: any;
  selectedStyle: any;
  onEditToggle: () => void;
  onSave: () => void;
  onDownloadVCard: () => void;
  onDownloadBusinessCard: () => void;
  onDownloadCV: () => void;
}

export function VCardActions({
  isEditing,
  isPdfGenerating,
  profile,
  selectedStyle,
  onEditToggle,
  onSave,
  onDownloadVCard,
  onDownloadBusinessCard,
  onDownloadCV,
}: VCardActionsProps) {
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const { messages, isLoading, handleSendMessage } = useChat();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile?.full_name || 'Profile',
          text: `Check out ${profile?.full_name || 'this'}'s professional profile`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isEditing ? (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="text-green-400 border-green-400/30 hover:bg-green-400/10"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onEditToggle}
            className="text-indigo-400 border-indigo-400/30 hover:bg-indigo-400/10"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Annuler
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onEditToggle}
            className="text-indigo-400 border-indigo-400/30 hover:bg-indigo-400/10"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Modifier
          </Button>

          <Dialog open={isAdvisorOpen} onOpenChange={setIsAdvisorOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-emerald-400 border-emerald-400/30 hover:bg-emerald-400/10"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Conseiller IA
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-gray-900/95 border-gray-800">
              <CareerAdvisorChat 
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
              />
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="text-blue-400 border-blue-400/30 hover:bg-blue-400/10"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadBusinessCard}
            disabled={isPdfGenerating}
            className="text-purple-400 border-purple-400/30 hover:bg-purple-400/10"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Carte de visite
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadCV}
            disabled={isPdfGenerating}
            className="text-pink-400 border-pink-400/30 hover:bg-pink-400/10"
          >
            <FileText className="h-4 w-4 mr-2" />
            CV
          </Button>
        </>
      )}
    </div>
  );
}