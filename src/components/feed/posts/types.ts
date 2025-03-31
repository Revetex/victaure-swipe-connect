
import { Post as BasePost, Comment as BaseComment } from '@/types/posts';

export interface CreatePostProps {
  onPostCreated?: () => void;
}

export interface CreatePostFormProps {
  newPost: string;
  onPostChange: (value: string) => void;
  privacy: PostPrivacyLevel;
  onPrivacyChange: (value: PostPrivacyLevel) => void;
  attachments: PostAttachment[];
  setAttachments?: React.Dispatch<React.SetStateAction<PostAttachment[]>>;
  isLoading?: boolean;
  isUploading?: boolean;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile?: (index: number) => void;
  onCreatePost: () => void;
  onClose: () => void;
  isExpanded?: boolean;
  onSubmit?: (content: string, privacyLevel: PostPrivacyLevel) => Promise<void>;
}

export interface PostAttachment {
  file: File;
  preview: string;
}

export type PostPrivacyLevel = "public" | "connections";

export type Post = BasePost;
export type Comment = BaseComment;
