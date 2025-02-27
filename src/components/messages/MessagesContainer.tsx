
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "@/components/ui/card";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationView } from "./conversation/ConversationView";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useThemeContext } from "@/components/ThemeProvider";

export function MessagesContainer() {
  const { receiver, showConversation } = useReceiver();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isDark } = useThemeContext();

  return (
    <Card className={cn(
      "fixed inset-0 top-16 flex h-[calc(100vh-4rem)] w-full",
      "border-0 rounded-none overflow-hidden",
      isDark 
        ? "bg-[#1A1F2C] border-[#242F44]" 
        : "bg-[#F1F0FB] border-slate-200"
    )}>
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isDark 
          ? "border-r border-[#64B5D9]/10 bg-[#1B2A4A]/50" 
          : "border-r border-slate-200 bg-slate-50/50",
        showConversation ? "hidden md:block md:w-80 lg:w-96" : "w-full md:w-80 lg:w-96"
      )}>
        <ConversationList />
      </div>
      
      {(showConversation || receiver) && (
        <div className={cn(
          "flex-1 flex flex-col h-full overflow-hidden",
          "transition-all duration-300"
        )}>
          <ConversationView />
        </div>
      )}
    </Card>
  );
}
