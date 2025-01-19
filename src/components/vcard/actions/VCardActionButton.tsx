import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface VCardActionButtonProps {
  icon?: LucideIcon;
  label?: string;
  onClick: () => void;
  variant?: "default" | "outline";
  disabled?: boolean;
  isProcessing?: boolean;
  className?: string;
}

export function VCardActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  disabled = false,
  isProcessing = false,
  className = "",
}: VCardActionButtonProps) {
  // Define fixed styles for buttons that won't be affected by VCard custom styles
  const buttonStyle = variant === "default" ? {
    backgroundColor: '#3B82F6',
    color: 'white',
    borderColor: '#2563EB',
    // Reset inherited styles
    fontFamily: 'inherit',
  } : {
    borderColor: '#3B82F6',
    color: '#3B82F6',
    backgroundColor: 'transparent',
    // Reset inherited styles
    fontFamily: 'inherit',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 min-w-[100px]"
      style={{ 
        // Reset inherited styles
        color: 'inherit',
        fontFamily: 'inherit',
        background: 'transparent'
      }}
    >
      <Button
        onClick={onClick}
        variant={variant}
        disabled={disabled || isProcessing}
        className={`w-full transition-colors !font-sans ${className}`}
        style={buttonStyle}
      >
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {label}
      </Button>
    </motion.div>
  );
}