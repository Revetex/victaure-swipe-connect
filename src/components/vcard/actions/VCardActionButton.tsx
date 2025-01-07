import { LucideIcon } from "lucide-react";
import { VCardStyledButton } from "../VCardStyledButton";

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
  return (
    <VCardStyledButton
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      className={className}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </VCardStyledButton>
  );
}