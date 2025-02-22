import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreatePostProps } from "./types";
import { useCreatePost } from "@/hooks/feed/useCreatePost";
import { CreatePostForm } from "./create/CreatePostForm";
export function CreatePost({
  onPostCreated
}: CreatePostProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    newPost,
    setNewPost,
    privacy,
    setPrivacy,
    attachments,
    isUploading,
    handleFileChange,
    removeFile,
    handleCreatePost
  } = useCreatePost(onPostCreated);
  return;
}