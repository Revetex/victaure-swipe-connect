import { LucideIcon } from "lucide-react";
import { VCardStyledButton } from "../VCardStyledButton";
import { useVCardStyle } from "../VCardStyleContext";

interface VCardActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  className?: string;
}

export function VCardActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "primary",
  disabled,
  className
}: VCardActionButtonProps) {
  const { selectedStyle } = useVCardStyle();

  const getButtonStyles = () => {
    switch (variant) {
      case "primary":
        return {
          bg: selectedStyle.colors.background.button,
          text: "text-white",
          border: `border-${selectedStyle.colors.primary}`,
          hover: `hover:bg-${selectedStyle.colors.primary}/90`
        };
      case "secondary":
        return {
          bg: "bg-white dark:bg-gray-800",
          text: `text-${selectedStyle.colors.text.primary} dark:text-white`,
          border: `border-${selectedStyle.colors.primary}/20`,
          hover: `hover:bg-${selectedStyle.colors.primary}/10`
        };
      case "outline":
        return {
          bg: "bg-transparent",
          text: `text-${selectedStyle.colors.text.primary} dark:text-white`,
          border: `border-${selectedStyle.colors.primary}/20`,
          hover: `hover:bg-${selectedStyle.colors.primary}/10`
        };
      default:
        return {
          bg: selectedStyle.colors.background.button,
          text: "text-white",
          border: `border-${selectedStyle.colors.primary}`,
          hover: `hover:bg-${selectedStyle.colors.primary}/90`
        };
    }
  };

  const styles = getButtonStyles();

  return (
    <VCardStyledButton
      onClick={onClick}
      disabled={disabled}
      className={`${styles.bg} ${styles.text} ${styles.border} ${styles.hover} transition-all duration-200 ${className}`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </VCardStyledButton>
  );
}