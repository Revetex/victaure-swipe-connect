
import { Post as BasePost, Comment as BaseComment } from '@/types/posts';

export interface CreatePostProps {
  onPostCreated?: () => void;
}

export interface CreatePostFormProps {
  attachments: PostAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<PostAttachment[]>>;
  isLoading: boolean;
  onSubmit: (content: string, privacyLevel: "public" | "connections") => Promise<void>;
  newPost: string;
  onPostChange: (value: string) => void;
  privacy: PostPrivacyLevel;
  onPrivacyChange: (value: PostPrivacyLevel) => void;
  onCreatePost: () => void;
  onClose: () => void;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile?: (index: number) => void;
  isExpanded?: boolean;
  isUploading?: boolean;
}

export interface PostAttachment {
  file: File;
  preview: string;
}

export type PostPrivacyLevel = "public" | "connections";

export type Post = BasePost;
export type Comment = BaseComment;
