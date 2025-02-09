
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { NavigationItemProps } from "./types";

export function NavigationItem({ icon: Icon, label, to }: NavigationItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200",
        "text-muted-foreground hover:text-foreground text-sm",
        "hover:bg-[#9b87f5]/10 active:scale-[0.98]",
        "group relative"
      )}
    >
      <Icon className="h-4 w-4 transition-colors duration-200" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}
