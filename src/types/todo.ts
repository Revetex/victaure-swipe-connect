import { LucideIcon } from "lucide-react";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  dueTime?: string;
  allDay?: boolean;
}

export interface StickyNote {
  id: string;
  text: string;
  color: string;
}

export interface ColorOption {
  value: string;
  label: string;
  class: string;
}

export interface Tool {
  name: string;
  icon: LucideIcon;
  description: string;
  path: string;
  color: string;
}