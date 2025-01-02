export interface Message {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}