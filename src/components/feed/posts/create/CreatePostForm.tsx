
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image, Send, Loader2, ImagePlus, X, ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FilePreview } from "../FilePreview";
import { PrivacySelector } from "../PrivacySelector";
import { AnimatePresence, motion } from "framer-motion";
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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      className={cn(
        "rounded-xl bg-[#1A1F2C] border border-white/10 transition-all duration-300",
        isExpanded ? "p-4" : "p-3"
      )}
      layout
    >
      {!isExpanded ? (
        <Button
          variant="ghost"
          className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5"
          onClick={() => setIsExpanded(true)}
        >
          Créer une publication...
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-white/90">Créer une publication</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/60 hover:text-white hover:bg-white/5"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>

          <Textarea
            value={newPost}
            onChange={(e) => onPostChange(e.target.value)}
            placeholder="Que souhaitez-vous partager ?"
            className="min-h-[100px] bg-white/5 border-white/10 text-white/90 placeholder:text-white/40 resize-none"
          />

          <AnimatePresence>
            {attachments.length > 0 && (
              <FilePreview files={attachments} onRemove={onRemoveFile} />
            )}
          </AnimatePresence>

          <motion.div layout className={cn("flex gap-4", isMobile ? "flex-col" : "flex-row justify-between items-center")}>
            <div className={cn("flex gap-2", isMobile ? "flex-col w-full" : "items-center")}>
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
                  "transition-colors w-full sm:w-auto bg-white/5 border-white/10 text-white/80 hover:bg-white/10",
                  attachments.length > 0 && "border-primary/50 text-primary"
                )}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                {attachments.length > 0 ? (
                  <>
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Ajouter
                  </>
                ) : (
                  <>
                    <Image className="h-4 w-4 mr-2" />
                    Image
                  </>
                )}
              </Button>

              <PrivacySelector
                value={privacy}
                onChange={onPrivacyChange}
                className={cn(
                  isMobile && "w-full",
                  "bg-white/5 border-white/10 text-white/80"
                )}
              />
            </div>

            <Button
              className="w-full sm:w-auto gap-2"
              disabled={isUploading || !newPost.trim()}
              onClick={onCreatePost}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Publier
            </Button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
