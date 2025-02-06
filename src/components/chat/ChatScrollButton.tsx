
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface ChatScrollButtonProps {
  onClick: () => void;
  show: boolean;
}

export function ChatScrollButton({ onClick, show }: ChatScrollButtonProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-20 right-4"
    >
      <Button
        size="icon"
        variant="secondary"
        onClick={onClick}
        className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
