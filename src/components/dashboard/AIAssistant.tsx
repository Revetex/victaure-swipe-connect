
import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

export interface AIAssistantProps {
  onClose: () => void;
  conversations?: any[];
}

export function AIAssistant({ onClose, conversations = [] }: AIAssistantProps) {
  const isMobile = useIsMobile();

  return (
    <Card className={`w-full h-full flex flex-col ${isMobile ? 'rounded-none' : 'rounded-lg'}`}>
      {/* Header - Fixed */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b safe-top">
        <div className="p-3 sm:p-4">
          <h2 className="text-lg sm:text-xl font-semibold">AI Assistant</h2>
        </div>
      </div>

      {/* Messages area - Scrollable */}
      <ScrollArea 
        className="flex-1 px-3 sm:px-4"
        style={{
          height: isMobile ? 'calc(100vh - 8rem)' : 'auto',
          touchAction: 'pan-y'
        }}
      >
        <div className="py-3 sm:py-4 space-y-3 sm:space-y-4">
          {/* Messages content */}
        </div>
      </ScrollArea>

      {/* Input area - Fixed */}
      <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t safe-bottom">
        <div className="p-3 sm:p-4">
          {/* Input form */}
        </div>
      </div>
    </Card>
  );
}
