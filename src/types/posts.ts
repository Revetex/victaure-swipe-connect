export interface Post {
  id: string;
  content: string;
  images?: string[];
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at?: string;
  user_id: string;
  privacy_level: 'public' | 'private' | 'connections';
  profiles: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}