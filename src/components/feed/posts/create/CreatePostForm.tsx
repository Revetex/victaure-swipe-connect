
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image, Send, Loader2, ImagePlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FilePreview } from "../FilePreview";
import { PrivacySelector } from "../PrivacySelector";
import { AnimatePresence } from "framer-motion";
import { PostAttachment, PostPrivacyLevel } from "../types";

interface CreatePostFormProps {
  newPost: string;
  onPostChange: (value: string) => void;
  privacy: PostPrivacyLevel;
  onPrivacyChange: (value: PostPrivacyLevel) => void;
  attachments: PostAttachment[];
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onCreatePost: () => void;
  onClose: () => void;
}

export function CreatePostForm({
  newPost,
  onPostChange,
  privacy,
  onPrivacyChange,
  attachments,
  isUploading,
  onFileChange,
  onRemoveFile,
  onCreatePost,
  onClose
}: CreatePostFormProps) {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Créer une publication</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Textarea
        value={newPost}
        onChange={(e) => onPostChange(e.target.value)}
        placeholder="Partagez quelque chose..."
        className="min-h-[120px] resize-none focus:ring-primary/20"
      />
      
      <AnimatePresence>
        {attachments.length > 0 && (
          <FilePreview 
            files={attachments}
            onRemove={onRemoveFile}
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "flex gap-4",
        isMobile ? "flex-col" : "flex-row justify-between items-center"
      )}>
        <div className={cn(
          "flex gap-2",
          isMobile ? "flex-col w-full" : "items-center"
        )}>
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={onFileChange}
            accept="image/*,.pdf,.doc,.docx"
          />
          <Button 
            variant="outline" 
            size="default"
            className={cn(
              "transition-colors w-full sm:w-auto",
              attachments.length > 0 && "border-primary/50 text-primary"
            )}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {attachments.length > 0 ? (
              <>
                <ImagePlus className="h-4 w-4 mr-2" />
                Ajouter une image
              </>
            ) : (
              <>
                <Image className="h-4 w-4 mr-2" />
                Ajouter une image
              </>
            )}
          </Button>
          
          <PrivacySelector
            value={privacy}
            onChange={onPrivacyChange}
            className={cn(isMobile && "w-full")}
          />
        </div>

        <Button 
          onClick={onCreatePost} 
          disabled={isUploading || (!newPost.trim() && attachments.length === 0)}
          className={cn(
            "transition-all",
            isMobile ? "w-full" : "w-auto",
            (newPost.trim() || attachments.length > 0) && "bg-primary hover:bg-primary/90"
          )}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Publier
        </Button>
      </div>
    </div>
  );
}
