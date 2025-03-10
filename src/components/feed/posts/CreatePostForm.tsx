
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

export interface CreatePostFormProps {
  newPost: string;
  onPostChange: (value: string) => void;
  privacy: PostPrivacyLevel;
  onPrivacyChange: (value: PostPrivacyLevel) => void;
  attachments: PostAttachment[];
  isUploading: boolean;
  onCreatePost: () => void;
  onClose: () => void;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile?: (index: number) => void;
  isExpanded?: boolean;
  // Add missing properties that are passed by CreatePost.tsx
  setAttachments?: React.Dispatch<React.SetStateAction<PostAttachment[]>>;
  onSubmit?: (content: string, privacyLevel: "public" | "connections") => Promise<void>;
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
  onClose,
  isExpanded = false,
  // Include defaults for the missing properties
  setAttachments,
  onSubmit
}: CreatePostFormProps) {
  const isMobile = useIsMobile();
  const [isExpandedInternal, setIsExpandedInternal] = useState(isExpanded);

  const handleClose = () => {
    setIsExpandedInternal(false);
    onClose();
  };

  return (
    <motion.div 
      className={cn(
        "rounded-xl bg-[#1A1F2C] border border-white/10 transition-all duration-300", 
        isExpandedInternal ? "p-3" : "p-2"
      )} 
      layout
    >
      {isExpandedInternal ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/color-logo.png" alt="Victaure" className="h-8 w-8 object-contain" />
              <h3 className="text-lg font-medium text-white/90">Créer une publication</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/60 hover:text-white hover:bg-white/5"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Textarea 
            value={newPost} 
            onChange={e => onPostChange(e.target.value)} 
            placeholder="Que souhaitez-vous partager ?" 
            className="min-h-[100px] bg-white/5 border-white/10 text-white/90 placeholder:text-white/40 resize-none" 
          />

          <AnimatePresence>
            {attachments.length > 0 && (
              <FilePreview files={attachments} onRemove={onRemoveFile} />
            )}
          </AnimatePresence>

          <motion.div 
            layout 
            className={cn("flex gap-4", isMobile ? "flex-col" : "flex-row justify-between items-center")}
          >
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
              onClick={() => {
                onCreatePost();
                handleClose();
              }}
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
      ) : (
        <div className="flex items-center w-full gap-4 px-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => setIsExpandedInternal(true)}
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            Cliquez pour écrire un message...
          </Button>
        </div>
      )}
    </motion.div>
  );
}
