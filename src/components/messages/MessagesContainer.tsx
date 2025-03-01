
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "@/components/ui/card";
import { ConversationView } from "./conversation/ConversationView";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useThemeContext } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { CustomConversationList } from "./CustomConversationList";
import { ConversationHeaderAdapter } from "./conversation/adapters/ConversationHeaderAdapter";

export function MessagesContainer() {
  const { receiver, showConversation } = useReceiver();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isDark } = useThemeContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "fixed inset-0 top-16 flex h-[calc(100vh-4rem)] w-full",
        "border-0 rounded-none overflow-hidden",
        isDark 
          ? "bg-background border-border" 
          : "bg-background border-slate-200"
      )}>
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          isDark 
            ? "border-r border-border/10 bg-muted/10" 
            : "border-r border-slate-200/70 bg-muted/5",
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
            {receiver && (
              <ConversationView />
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
