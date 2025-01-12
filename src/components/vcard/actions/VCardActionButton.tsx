import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface VCardActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isProcessing?: boolean;
  variant?: "default" | "outline";
  className?: string;
}

export function VCardActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  isProcessing,
  variant = "default",
  className
}: VCardActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      className={cn(
        "group relative overflow-hidden",
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      <motion.div
        className="flex items-center justify-center gap-2"
        initial={false}
        animate={{
          opacity: isProcessing ? 0 : 1,
          y: isProcessing ? -20 : 0
        }}
      >
        <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
        {label}
      </motion.div>
      
      {isProcessing && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Loader className="h-4 w-4" />
        </motion.div>
      )}
    </Button>
  );
}