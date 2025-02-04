export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url?: string;  // Made optional to match database schema
  };
}

export interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  images?: string[];
  likes: number;
  dislikes: number;
  privacy_level: 'public' | 'connections';
  profiles: {
    id: string;
    full_name: string;
    avatar_url?: string;  // Made optional to match database schema
  };
  comments?: Comment[];
  reactions?: {
    id: string;
    user_id: string;
    reaction_type: 'like' | 'dislike';
  }[];
}