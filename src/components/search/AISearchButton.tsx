import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AISearchButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export function AISearchButton({ onClick, isLoading }: AISearchButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="relative"
      disabled={isLoading}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2"
      >
        <Sparkles className="h-4 w-4" />
        <span>IA</span>
      </motion.span>
    </Button>
  );
}