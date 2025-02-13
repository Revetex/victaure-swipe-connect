
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardMainProps {
  children: ReactNode;
}

export function DashboardMain({ children }: DashboardMainProps) {
  return (
    <main 
      className={cn(
        "flex-1 w-full overflow-x-hidden",
        "bg-background pt-16"
      )}
    >
      <div className="w-full max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
}
