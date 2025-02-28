

import { Post as BasePost, Comment as BaseComment } from '@/types/posts';

export interface CreatePostProps {
  onPostCreated?: () => void;
}

export interface CreatePostFormProps {
  attachments: PostAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<PostAttachment[]>>;
  isLoading: boolean;
  onSubmit: (content: string, privacyLevel: "public" | "connections") => Promise<void>;
}

export interface PostAttachment {
  file: File;
  preview: string;
}

export type PostPrivacyLevel = "public" | "connections";

export type Post = BasePost;
export type Comment = BaseComment;

