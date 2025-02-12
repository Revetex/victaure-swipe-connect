
import { NavigationItem } from "./NavigationItem";
import { LucideIcon } from "lucide-react";

interface NavigationSectionProps {
  title: string;
  items: {
    id: number;
    icon: LucideIcon;
    name: string;
  }[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function NavigationSection({ title, items, currentPage, onPageChange }: NavigationSectionProps) {
  return (
    <div className="space-y-0.5">
      <div className="px-2 py-1">
        <h2 className="text-xs font-semibold text-muted-foreground">{title}</h2>
      </div>
      {items.map((item) => (
        <NavigationItem
          key={item.id}
          id={item.id}
          icon={item.icon}
          name={item.name}
          isActive={currentPage === item.id}
          onClick={() => onPageChange(item.id)}
        />
      ))}
    </div>
  );
}
