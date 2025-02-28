
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
