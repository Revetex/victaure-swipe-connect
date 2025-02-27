
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
}

export function Loader({ className, size = "default", ...props }: LoaderProps) {
  const sizeStyles = {
    sm: "h-4 w-4 border-2",
    default: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-primary border-t-transparent",
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
