import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    const baseStyles = {
      transition: "all 0.2s ease",
      color: variant === "primary" ? "white" : selectedStyle.colors.text.primary,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyles,
          backgroundColor: selectedStyle.colors.primary,
          border: `1px solid ${selectedStyle.colors.primary}`,
          "&:hover": {
            backgroundColor: selectedStyle.colors.secondary,
          }
        };
      case "secondary":
      case "outline":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          border: `1px solid ${selectedStyle.colors.primary}40`,
          "&:hover": {
            backgroundColor: `${selectedStyle.colors.primary}10`,
          }
        };
      default:
        return baseStyles;
    }
  };

  const styles = getButtonStyles();

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`${className} transition-all duration-200`}
      style={styles}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}