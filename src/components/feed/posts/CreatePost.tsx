
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
    content,
    setContent,
    privacyLevel,
    setPrivacyLevel,
    attachments,
    isLoading,
    addAttachment,
    removeAttachment,
    createPost
  } = useCreatePost(onPostCreated);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        addAttachment(e.target.files[i]);
      }
    }
  };

  const handleCreatePost = async () => {
    await createPost();
    setIsExpanded(false);
  };

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
          newPost={content}
          onPostChange={setContent}
          privacy={privacyLevel}
          onPrivacyChange={setPrivacyLevel}
          attachments={attachments}
          isUploading={isLoading}
          onFileChange={handleFileChange}
          onRemoveFile={removeAttachment}
          onCreatePost={handleCreatePost}
          onClose={() => setIsExpanded(false)}
        />
      )}
    </Card>
  );
}
