import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { QuickSuggestions } from "./QuickSuggestions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat/messageTypes";
import { useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Briefcase, GraduationCap, Trophy } from "lucide-react";

interface CareerAdvisorChatProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export function CareerAdvisorChat({
  messages,
  isLoading,
  onSendMessage,
}: CareerAdvisorChatProps) {
  const { profile } = useProfile();

  // Send personalized initial greeting
  useEffect(() => {
    if (messages.length === 0 && profile) {
      const initialMessage = generateInitialMessage(profile);
      onSendMessage(initialMessage);
    }
  }, [messages.length, profile, onSendMessage]);

  const generateInitialMessage = (profile: any) => {
    const greeting = profile?.full_name 
      ? `Bonjour ${profile.full_name}! `
      : "Bonjour! ";

    const context = profile?.role
      ? `Je vois que vous êtes dans le domaine ${profile.role}. `
      : "";

    const skillsContext = profile?.skills?.length
      ? `Je remarque que vous avez des compétences en ${profile.skills.slice(0, 3).join(", ")}. `
      : "";

    return `${greeting}${context}${skillsContext}Comment puis-je vous aider dans votre développement professionnel aujourd'hui?`;
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-background/50 backdrop-blur-sm border-b">
        <Card className="p-4 flex items-center gap-2 hover:bg-accent/5 transition-colors cursor-pointer">
          <Brain className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <h3 className="font-medium">Compétences</h3>
            <p className="text-sm text-muted-foreground">
              {profile?.skills?.length || 0} acquises
            </p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-2 hover:bg-accent/5 transition-colors cursor-pointer">
          <Briefcase className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <h3 className="font-medium">Expérience</h3>
            <p className="text-sm text-muted-foreground">Parcours pro</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-2 hover:bg-accent/5 transition-colors cursor-pointer">
          <GraduationCap className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <h3 className="font-medium">Formation</h3>
            <p className="text-sm text-muted-foreground">Parcours académique</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-2 hover:bg-accent/5 transition-colors cursor-pointer">
          <Trophy className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <h3 className="font-medium">Objectifs</h3>
            <p className="text-sm text-muted-foreground">Progression</p>
          </div>
        </Card>
      </div>

      <ScrollArea className="flex-1 p-4">
        <ChatMessages 
          messages={messages} 
          isTyping={isLoading} 
        />
      </ScrollArea>

      <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          {profile?.skills?.slice(0, 5).map((skill: string, index: number) => (
            <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary/20">
              {skill}
            </Badge>
          ))}
        </div>
        <QuickSuggestions onSelect={onSendMessage} />
        <ChatInput isLoading={isLoading} onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}