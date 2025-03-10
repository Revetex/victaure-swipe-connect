
export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  images?: string[];
  likes: number;
  dislikes: number;
  privacy_level: 'public' | 'connections';
  profiles: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  reactions?: {
    id: string;
    user_id: string;
    reaction_type: 'like' | 'dislike';
  }[];
  comments?: Comment[];
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    role?: string;
  };
}
