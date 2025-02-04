export interface MessageSender {
  id: string;
  full_name: string;
  avatar_url: string;
  online_status: boolean;
  last_seen: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  sender: MessageSender;
  receiver?: MessageSender;
  timestamp: Date;
  thinking?: boolean;
}

export interface Receiver {
  id: string;
  full_name: string;
  avatar_url: string;
  online_status: boolean;
  last_seen: string;
}

export interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string | null;
  images: string[] | null;
  likes: number;
  dislikes: number;
  privacy_level: "public" | "connections";
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  reactions: {
    id: string;
    user_id: string;
    reaction_type: "like" | "dislike";
  }[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}