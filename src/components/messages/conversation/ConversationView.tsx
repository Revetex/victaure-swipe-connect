import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { AnimatePresence, motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import { UserProfile } from "@/types/profile";
import { Message } from "@/types/messages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ConversationViewProps {
  messages: Message[];
  profile: UserProfile | null;
  isThinking?: boolean;
  isListening?: boolean;
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  onVoiceInput?: () => void;
  onBack?: () => void;
  onDeleteConversation?: () => void;
}

export function ConversationView({
  messages,
  profile,
  isThinking,
  isListening,
  inputMessage,
  onInputChange,
  onSendMessage,
  onVoiceInput,
  onBack,
  onDeleteConversation
}: ConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollButton(!isNearBottom);
  };

  const handleDelete = () => {
    if (onDeleteConversation) {
      onDeleteConversation();
      toast.success("Conversation supprimée avec succès");
    }
    setShowDeleteDialog(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-background">
      <header className="sticky top-0 shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={profile?.avatar_url || undefined}
                alt={profile?.full_name || "Profile"}
              />
              <AvatarFallback>
                <UserCircle className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">
                {profile?.full_name || "Utilisateur"}
              </span>
              <span className="text-xs text-muted-foreground">
                {profile?.email || ""}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer la conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        <div className="px-4 py-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                sender={typeof message.sender === 'string' ? message.sender : message.sender.id}
                thinking={message.thinking}
                showTimestamp={true}
                timestamp={message.created_at}
              />
            ))}
          </AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                <div
                  className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 shrink-0 border-t bg-background/95 backdrop-blur-sm p-4">
        <ChatInput
          value={inputMessage}
          onChange={onInputChange}
          onSend={() => onSendMessage(inputMessage)}
          onVoiceInput={onVoiceInput}
          isListening={isListening}
          isThinking={isThinking}
          placeholder="Écrivez votre message..."
          className="w-full"
        />
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}