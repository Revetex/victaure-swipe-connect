
import { FilePreview } from "../FilePreview";
import { Textarea } from "@/components/ui/textarea";

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
  if (isEditing) {
    return (
      <Textarea
        value={editContent}
        onChange={(e) => onEditContentChange(e.target.value)}
        className="min-h-[100px] bg-[#F2EBE4]/5 border-[#64B5D9]/10 text-[#F2EBE4] focus:border-[#64B5D9]/30"
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="whitespace-pre-wrap text-[#F2EBE4]">{content}</p>
      {images && images.length > 0 && (
        <FilePreview files={images} />
      )}
    </div>
  );
}
