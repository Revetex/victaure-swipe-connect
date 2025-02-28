import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Loader({ className, ...props }: LoaderProps) {
  return (
    <div {...props} className={cn("animate-spin text-muted-foreground", className)}>
      <Loader2 className="w-full h-full" />
    </div>
  );
}