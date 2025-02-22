
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreatePostProps } from "./types";
import { useCreatePost } from "@/hooks/feed/useCreatePost";
import { CreatePostForm } from "./create/CreatePostForm";

export function CreatePost({ onPostCreated }: CreatePostProps) {
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

  // Transformer les PostAttachments en URLs pour le preview
  const attachmentUrls = attachments.map(attachment => attachment.preview);

  return (
    <Card className={cn(
      "shadow-lg border-primary/10 transition-all duration-200",
      isExpanded ? "p-4" : "p-2",
      "mx-auto max-w-3xl w-full mt-[4.5rem]"
    )}>
      {!isExpanded ? (
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground h-auto py-3 px-4"
          onClick={() => setIsExpanded(true)}
        >
          Partagez quelque chose...
        </Button>
      ) : (
        <CreatePostForm
          newPost={newPost}
          onPostChange={setNewPost}
          privacy={privacy}
          onPrivacyChange={setPrivacy}
          attachments={attachmentUrls}
          isUploading={isUploading}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
          onCreatePost={handleCreatePost}
          onClose={() => setIsExpanded(false)}
        />
      )}
    </Card>
  );
}
