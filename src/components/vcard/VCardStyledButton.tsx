import { Button } from "@/components/ui/button";
import { useVCardStyle } from "./VCardStyleContext";
import { cn } from "@/lib/utils";

interface VCardStyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
  className?: string;
}

export function VCardStyledButton({ 
  variant = "primary", 
  children, 
  className,
  ...props 
}: VCardStyledButtonProps) {
  const { selectedStyle } = useVCardStyle();

  const getButtonStyles = () => {
    const styles = {
      primary: {
        background: selectedStyle.colors.background.button,
        color: "text-white",
        border: `border-${selectedStyle.colors.primary}`,
      },
      secondary: {
        background: `hover:bg-${selectedStyle.colors.primary}/10`,
        color: `text-${selectedStyle.colors.text.primary}`,
        border: `border-${selectedStyle.colors.primary}/20`,
      },
      outline: {
        background: "bg-transparent",
        color: `text-${selectedStyle.colors.text.primary}`,
        border: `border-${selectedStyle.colors.primary}/20`,
      }
    };

    return styles[variant];
  };

  const buttonStyles = getButtonStyles();

  return (
    <Button
      className={cn(
        buttonStyles.background,
        buttonStyles.color,
        buttonStyles.border,
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}