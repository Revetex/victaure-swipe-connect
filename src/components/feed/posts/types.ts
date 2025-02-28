
export interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  images?: string[];
  likes?: number;
  dislikes?: number;
  privacy_level: string;
  comment_count?: number;
  author?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  created_at: string;
  parent_id?: string;
  author?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
  replies?: Comment[];
}

export interface PostFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  sortBy: "likes" | "comments" | "date";
  onSortByChange: (value: "likes" | "comments" | "date") => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  onCreatePost: () => void;
}

export interface PostAttachment {
  id: string;
  file: File;
  previewUrl: string;
  type: 'image' | 'document' | 'video';
}

export type PostPrivacyLevel = 'public' | 'connections' | 'private';

export interface CreatePostProps {
  newPost: string;
  onPostChange: (value: string) => void;
  privacy: PostPrivacyLevel;
  onPrivacyChange: (value: PostPrivacyLevel) => void;
  attachments: PostAttachment[];
  isUploading: boolean;
  onCreatePost: () => void;
  onClose: () => void;
  isExpanded: boolean;
}

export interface PostCommentsProps {
  postId: string;
  comments?: Comment[];
  currentUserId: string;
  onDeleteComment?: (commentId: string) => Promise<void>;
}

export interface PostCardProps {
  post: Post;
  currentUserId: string;
  userEmail: string;
  onDelete: () => void;
  onHide: (postId: string) => void;
  onUpdate: (postId: string, content: string) => void;
  onReaction?: (postId: string, type: "like" | "dislike") => Promise<void>;
  onCommentAdded?: () => Promise<void>;
}
