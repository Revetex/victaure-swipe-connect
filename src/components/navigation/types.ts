
import { LucideIcon } from "lucide-react";

export interface NavigationSection {
  title: string;
  items: {
    icon: LucideIcon;
    label: string;
    to: string;
  }[];
}

export interface NavigationItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
}

export interface NavigationSectionProps {
  section: NavigationSection;
  isOpen: boolean;
  onToggle: () => void;
}
