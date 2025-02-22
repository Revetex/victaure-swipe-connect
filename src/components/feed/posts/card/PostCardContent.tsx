
import { Textarea } from "@/components/ui/textarea";
import { PostImageGrid } from "../PostImageGrid";

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
          className="min-h-[80px] resize-none mobile-friendly-input"
          placeholder="Que voulez-vous partager ?"
        />
      ) : (
        content && (
          <div className="text-sm text-foreground/90 whitespace-pre-wrap">
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
