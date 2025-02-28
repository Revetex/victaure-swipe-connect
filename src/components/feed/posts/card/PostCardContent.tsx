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
  return <div className="space-y-3 mt-3 bg-gray-900">
      {isEditing ? <Textarea value={editContent} onChange={e => onEditContentChange(e.target.value)} placeholder="Que voulez-vous partager ?" className="min-h-[80px] resize-none mobile-friendly-input text-[#F2EBE4] bg-transparent my-0 px-[25px]" /> : content && <div className="text-sm text-[#F2EBE4] whitespace-pre-wrap bg-gray-900">
            {content}
          </div>}
      
      {images && images.length > 0 && <PostImageGrid images={images} />}
    </div>;
}