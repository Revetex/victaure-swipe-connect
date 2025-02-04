import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

export function ChatThinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-start gap-4 p-4 bg-muted/50"
    >
      <Avatar className="h-10 w-10 ring-2 ring-primary/20">
        <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-6 w-6 text-primary" />
        </div>
      </Avatar>
      
      <Card className="bg-card border-primary/10 p-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-primary">M. Victaure</p>
          <motion.div className="flex gap-1 items-center">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: i * 0.2
                }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            ))}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}