import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };

  return (
    <div className={cn("relative", className)}>
      <img 
        src="/lovable-uploads/78b41840-19a1-401c-a34f-864298825f44.png" 
        alt="Victaure Logo" 
        className={cn("object-contain", sizeClasses[size])}
      />
    </div>
  );
}