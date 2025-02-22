
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  dueTime?: string;
  allDay?: boolean;
  category?: string;
  priority?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface StickyNote {
  id: string;
  text: string;
  color: string;
  category?: string;
  priority?: string;
  title?: string;
  pinned?: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  metadata?: {
    width?: number;
    height?: number;
    [key: string]: any;
  };
  position?: {
    x: number;
    y: number;
  };
  layout_type?: 'grid' | 'masonry' | 'list';
}

export interface ColorOption {
  value: string;
  label: string;
  class: string;
}
