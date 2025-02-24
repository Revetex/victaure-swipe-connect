
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  user_id: string;
  due_date?: string;
  due_time?: string;
  all_day?: boolean;
  created_at?: string;
  updated_at?: string;
}
