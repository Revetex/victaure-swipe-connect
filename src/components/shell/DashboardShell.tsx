
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardShell({
  children,
  className,
}: DashboardShellProps) {
  return (
    <div className={cn("container p-4 md:p-8 max-w-7xl mx-auto", className)}>
      {children}
    </div>
  );
}
