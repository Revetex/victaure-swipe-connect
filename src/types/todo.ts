export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: Date;
  dueTime?: string;
}

export interface StickyNote {
  id: number;
  text: string;
  color: string;
}

export interface ColorOption {
  value: string;
  label: string;
  class: string;
}