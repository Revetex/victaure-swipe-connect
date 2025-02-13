
import { PostHeader } from "../../PostHeader";
import { Button } from "@/components/ui/button";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="flex justify-between items-start gap-3">
      <PostHeader 
        profile={profile}
        created_at={created_at}
        privacy_level={privacy_level}
      />
      
      {isOwnPost && (
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSave}
                className={cn(
                  "text-primary hover:text-primary/90 hover:bg-primary/10",
                  "min-h-[44px] min-w-[44px] touch-manipulation"
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
                  "text-muted-foreground hover:text-foreground",
                  "min-h-[44px] min-w-[44px] touch-manipulation"
                )}
                aria-label="Annuler les modifications"
                title="Annuler les modifications"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className={cn(
                  "text-primary hover:text-primary/90 hover:bg-primary/10",
                  "min-h-[44px] min-w-[44px] touch-manipulation"
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
                  "text-destructive hover:text-destructive/90 hover:bg-destructive/10",
                  "min-h-[44px] min-w-[44px] touch-manipulation"
                )}
                aria-label="Supprimer la publication"
                title="Supprimer la publication"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
