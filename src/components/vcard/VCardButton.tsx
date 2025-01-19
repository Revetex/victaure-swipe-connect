import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VCardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  children: React.ReactNode;
  className?: string;
  isProcessing?: boolean;
}

export function VCardButton({
  variant = "default",
  children,
  className,
  isProcessing,
  ...props
}: VCardButtonProps) {
  const baseStyles = {
    default: "bg-blue-500 hover:bg-blue-600 text-white border-none",
    outline: "border-blue-500 text-blue-500 hover:bg-blue-50 bg-transparent",
    ghost: "text-blue-500 hover:bg-blue-50 border-none bg-transparent",
  };

  return (
    <Button
      variant={variant}
      className={cn(
        "transition-all duration-200 font-sans",
        baseStyles[variant],
        className
      )}
      disabled={isProcessing}
      {...props}
    >
      {children}
    </Button>
  );
}