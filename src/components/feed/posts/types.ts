
export interface CreatePostProps {
  onPostCreated: () => void;
}

export interface PostAttachment {
  file: File;
  preview: string;
}

export type PostPrivacyLevel = "public" | "connections";
