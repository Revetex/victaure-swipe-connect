
import { navigationSections } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  onNavigate?: () => void;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export function Navigation({ onNavigate, className, orientation = "vertical" }: NavigationProps) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <nav className={cn(
      "text-sm",
      orientation === "horizontal" ? "flex-row" : "flex-col",
      className
    )}>
      {navigationSections.map((section) => (
        <div
          key={section.id}
          className={cn(
            "space-y-1",
            orientation === "horizontal" ? "flex items-center gap-4" : ""
          )}
        >
          {section.items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  orientation === "horizontal" ? "flex-row" : "w-full",
                  "relative z-10"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className={cn(
                  orientation === "horizontal" ? "hidden sm:inline" : ""
                )}>
                  {item.name}
                </span>
                {item.badge && (
                  <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
