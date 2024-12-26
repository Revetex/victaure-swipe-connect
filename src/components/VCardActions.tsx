import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Save } from "lucide-react";

interface VCardActionsProps {
  isEditing: boolean;
  onShare: () => void;
  onDownload: () => void;
  onCopyLink: () => void;
  onSave: () => void;
  onApplyChanges: () => void;
}

export function VCardActions({
  isEditing,
  onShare,
  onDownload,
  onCopyLink,
  onSave,
  onApplyChanges,
}: VCardActionsProps) {
  return (
    <div className="flex gap-3 pt-4 border-t">
      {isEditing ? (
        <>
          <Button onClick={onSave} className="flex-1 bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button onClick={onApplyChanges} variant="secondary" className="flex-1">
            Appliquer les changements
          </Button>
        </>
      ) : (
        <>
          <Button onClick={onShare} className="flex-1">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button onClick={onDownload} variant="outline" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download VCard
          </Button>
          <Button onClick={onCopyLink} variant="outline">
            <Copy className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}