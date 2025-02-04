export interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  images?: string[];
  likes: number;
  dislikes: number;
  privacy_level: "public" | "connections";
  profiles?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  reactions?: {
    reaction_type: string;
    user_id: string;
  }[];
  comments?: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
      id: string;
      full_name: string;
      avatar_url?: string;
    };
  }[];
}

export interface PostHeaderProps {
  post: Post;
}

export interface PostContentProps {
  post: Post;
}

export interface PostActionsProps {
  likes: number;
  dislikes: number;
  commentCount: number;
  userReaction?: string;
  isExpanded: boolean;
  onLike: () => void;
  onDislike: () => void;
  onToggleComments: () => void;
}

export interface PostCommentsProps {
  postId: string;
}