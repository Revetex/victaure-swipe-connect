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
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url?: string;  // Made optional to match the actual data structure
  };
}

export interface PostHeaderProps {
  profile: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  created_at: string;
  privacy_level: "public" | "connections";
}

export interface PostContentProps {
  content: string;
  postId: string;
  currentUserId?: string;
  userEmail?: string;
  likes: number;
  dislikes: number;
  commentCount: number;
  userReaction?: string;
  comments?: Comment[];
  onReaction?: (type: 'like' | 'dislike') => void;
  onCommentAdded?: () => void;
}

export interface PostActionsProps {
  currentUserId?: string;
  postUserId: string;
  onDelete?: () => void;
  onHide?: () => void;
}

export interface PostCommentsProps {
  comments: Comment[];
  currentUserId?: string;
  onDeleteComment?: () => void;
}