import { MessageSquare } from "lucide-react";
import { AIAssistant } from "../chat/AIAssistant";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MessagesTab() {
  const [showConversationList, setShowConversationList] = useState(true);

  return (
    <div className="flex flex-col h-full">
      {showConversationList ? (
        <div className="p-4 space-y-4">
          <div 
            onClick={() => setShowConversationList(false)}
            className="flex items-center p-4 space-x-4 bg-primary/5 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors"
          >
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Mr Victaure</h3>
              <p className="text-sm text-muted-foreground">Assistant IA Personnel</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConversationList(true)}
            className="absolute top-0 left-0 z-50 m-2"
          >
            Retour
          </Button>
          <div className="h-full pt-12">
            <AIAssistant onBack={() => setShowConversationList(true)} />
          </div>
        </div>
      )}
    </div>
  );
}