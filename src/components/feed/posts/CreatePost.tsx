
import { useState, lazy, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send, Loader2, X, ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CreatePostProps, PostAttachment, PostPrivacyLevel } from "./types";
import { PrivacySelector } from "./PrivacySelector";

// Lazy load FilePreview component
const FilePreview = lazy(() => import("./FilePreview"));

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [newPost, setNewPost] = useState("");
  const [privacy, setPrivacy] = useState<PostPrivacyLevel>("public");
  const [attachments, setAttachments] = useState<PostAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { profile } = useProfile();
  const isMobile = useIsMobile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newAttachments = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeFile = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      URL.revokeObjectURL(newAttachments[index].preview);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const handleCreatePost = async () => {
    if (!profile) {
      toast.error("Vous devez être connecté pour publier");
      return;
    }

    if (!newPost.trim() && attachments.length === 0) {
      toast.error("Veuillez ajouter du contenu ou une image");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedFiles: string[] = [];

      for (const { file } of attachments) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('post_attachments')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('post_attachments')
          .getPublicUrl(fileName);

        uploadedFiles.push(publicUrl);
      }

      const { error } = await supabase
        .from("posts")
        .insert([{
          content: newPost,
          user_id: profile.id,
          privacy_level: privacy,
          images: uploadedFiles
        }]);

      if (error) throw error;

      setNewPost("");
      setAttachments([]);
      setIsExpanded(false);
      onPostCreated();
      toast.success("Publication créée avec succès");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erreur lors de la création de la publication");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className={cn(
      "shadow-lg border-primary/10 transition-all duration-200",
      isExpanded ? "p-4" : "p-2",
      "mx-auto max-w-3xl w-full"
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
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Créer une publication</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Partagez quelque chose..."
            className="min-h-[120px] resize-none focus:ring-primary/20"
          />
          
          <AnimatePresence>
            {attachments.length > 0 && (
              <Suspense fallback={
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              }>
                <FilePreview 
                  files={attachments}
                  onRemove={removeFile}
                />
              </Suspense>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex gap-2 items-center">
              <input
                type="file"
                id="file-upload"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
              />
              <Button 
                variant="outline" 
                size="default"
                className={cn(
                  "transition-colors flex-1 sm:flex-none",
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
                onChange={value => setPrivacy(value)}
              />
            </div>

            <Button 
              onClick={handleCreatePost} 
              disabled={isUploading || (!newPost.trim() && attachments.length === 0)}
              className={cn(
                "transition-all w-full sm:w-auto",
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
        </motion.div>
      )}
    </Card>
  );
}
