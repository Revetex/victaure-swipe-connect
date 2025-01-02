export interface Message {
  id: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  content: string;
  created_at: string;
  read: boolean;
}