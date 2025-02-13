
import { PostHeader } from "../../PostHeader";
import { Button } from "@/components/ui/button";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PostCardHeaderProps {
  profile: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  created_at: string;
  privacy_level: "public" | "connections";
  isOwnPost: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function PostCardHeader({
  profile,
  created_at,
  privacy_level,
  isOwnPost,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete
}: PostCardHeaderProps) {
  return (
    <div className={cn(
      "flex justify-between items-start gap-3",
      "pb-2 border-b border-border/40"
    )}>
      <PostHeader 
        profile={profile}
        created_at={created_at}
        privacy_level={privacy_level}
      />
      
      {isOwnPost && (
        <div className="flex gap-1">
          {isEditing ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-1"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onSave}
                className={cn(
                  "h-8 w-8 rounded-full",
                  "text-accent hover:text-accent/90",
                  "hover:bg-accent/10",
                  "transition-colors"
                )}
                aria-label="Sauvegarder les modifications"
                title="Sauvegarder les modifications"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className={cn(
                  "h-8 w-8 rounded-full",
                  "text-muted-foreground hover:text-foreground",
                  "hover:bg-accent/10",
                  "transition-colors"
                )}
                aria-label="Annuler les modifications"
                title="Annuler les modifications"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-1"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className={cn(
                  "h-8 w-8 rounded-full",
                  "text-accent hover:text-accent/90",
                  "hover:bg-accent/10",
                  "transition-colors"
                )}
                aria-label="Modifier la publication"
                title="Modifier la publication"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className={cn(
                  "h-8 w-8 rounded-full",
                  "text-destructive hover:text-destructive/90",
                  "hover:bg-destructive/10",
                  "transition-colors"
                )}
                aria-label="Supprimer la publication"
                title="Supprimer la publication"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
