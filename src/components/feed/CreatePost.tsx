
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send, Globe, Lock, Loader2, X, ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface CreatePostProps {
  onPostCreated: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [newPost, setNewPost] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "connections">("public");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { profile } = useProfile();
  const isMobile = useIsMobile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() && files.length === 0) {
      toast.error("Veuillez ajouter du contenu ou une image");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedFiles: string[] = [];

      for (const file of files) {
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
        .insert([
          {
            content: newPost,
            user_id: profile?.id,
            privacy_level: privacy,
            images: uploadedFiles
          }
        ]);

      if (error) throw error;

      setNewPost("");
      setFiles([]);
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
    <Card className="p-4 shadow-lg border-primary/10">
      <div className="space-y-4">
        <Textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Partagez quelque chose..."
          className="min-h-[100px] resize-none focus:ring-primary/20"
        />
        
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap gap-2"
            >
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  {file.type.startsWith('image/') ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ) : (
                    <div className="h-20 w-20 flex items-center justify-center bg-muted rounded-lg">
                      <span className="text-xs text-center break-words p-2">
                        {file.name}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center gap-4">
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
              size="icon" 
              className={cn(
                "h-9 w-9 transition-colors",
                files.length > 0 && "border-primary/50 text-primary"
              )}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              {files.length > 0 ? (
                <ImagePlus className="h-4 w-4" />
              ) : (
                <Image className="h-4 w-4" />
              )}
            </Button>
            
            <Select value={privacy} onValueChange={(value: "public" | "connections") => setPrivacy(value)}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Public</span>
                  </div>
                </SelectItem>
                <SelectItem value="connections">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Connexions uniquement</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleCreatePost} 
            disabled={isUploading || (!newPost.trim() && files.length === 0)}
            size="sm"
            className={cn(
              "h-9 px-4 transition-all",
              (newPost.trim() || files.length > 0) && "bg-primary hover:bg-primary/90"
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
    </Card>
  );
}

