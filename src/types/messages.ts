
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface Message extends ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  metadata?: Record<string, any>;
  sender: UserProfile;
  conversation_id?: string;
  deleted_at?: string;
  deleted_by?: Record<string, any>;
  edited_at?: string;
  encrypted?: boolean;
  encryption_key?: string;
  has_attachment?: boolean;
  is_assistant?: boolean;
  is_deleted?: boolean;
  is_system_sender?: boolean;
  message_hash?: string;
  message_state?: string;
  message_type?: string;
  page_cursor?: string;
  reaction?: string;
  status?: string;
  system_message?: boolean;
  timestamp?: string;
}
