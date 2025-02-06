import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PublicProfileHeaderProps {
  onDownloadVCard: () => void;
  onDownloadBusinessCard: () => Promise<void>;
}

export function PublicProfileHeader({ onDownloadVCard, onDownloadBusinessCard }: PublicProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDownloadBusinessCard()}
        className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
      >
        <FileText className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}