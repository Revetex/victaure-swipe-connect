
import { Textarea } from "@/components/ui/textarea";
import { PostImageGrid } from "../PostImageGrid";
import { cn } from "@/lib/utils";

interface PostCardContentProps {
  content: string;
  images?: string[];
  isEditing: boolean;
  editContent: string;
  onEditContentChange: (value: string) => void;
}

export function PostCardContent({
  content,
  images,
  isEditing,
  editContent,
  onEditContentChange
}: PostCardContentProps) {
  return (
    <div className="space-y-3 mt-3">
      {isEditing ? (
        <Textarea
          value={editContent}
          onChange={(e) => onEditContentChange(e.target.value)}
          className={cn(
            "min-h-[80px] resize-none",
            "bg-accent/5 border-accent/20",
            "focus:border-accent/30 focus:ring-accent/20",
            "placeholder:text-muted-foreground/50",
            "rounded-lg"
          )}
          placeholder="Que voulez-vous partager ?"
        />
      ) : (
        content && (
          <div className={cn(
            "text-sm leading-relaxed",
            "text-foreground/90",
            "whitespace-pre-wrap",
            "break-words"
          )}>
            {content}
          </div>
        )
      )}
      
      {images && images.length > 0 && (
        <PostImageGrid images={images} />
      )}
    </div>
  );
}
