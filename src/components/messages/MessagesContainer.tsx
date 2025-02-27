
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "@/components/ui/card";
import { ConversationView } from "./conversation/ConversationView";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useThemeContext } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { CustomConversationList } from "./CustomConversationList";

export function MessagesContainer() {
  const { receiver, showConversation } = useReceiver();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isDark } = useThemeContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "fixed inset-0 top-16 flex h-[calc(100vh-4rem)] w-full",
        "border-0 rounded-none overflow-hidden shadow-xl",
        isDark 
          ? "bg-gradient-to-b from-[#1A1F2C] to-[#141824] border-[#242F44]" 
          : "bg-gradient-to-b from-[#F1F0FB] to-[#F9F8FF] border-slate-200"
      )}>
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          isDark 
            ? "border-r border-[#64B5D9]/10 bg-[#1B2A4A]/60 backdrop-blur-sm" 
            : "border-r border-slate-200 bg-slate-50/80 backdrop-blur-sm",
          showConversation ? "hidden md:block md:w-80 lg:w-96" : "w-full md:w-80 lg:w-96"
        )}>
          <CustomConversationList />
        </div>
        
        {(showConversation || receiver) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "flex-1 flex flex-col h-full overflow-hidden",
              "transition-all duration-300"
            )}
          >
            <ConversationView />
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
