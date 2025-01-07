import { QRCodeSVG } from "qrcode.react";
import { VCardActions } from "./VCardActions";
import { StyleOption } from "./types";

interface VCardFooterProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  isProcessing: boolean;
  selectedStyle: StyleOption;
  onEditToggle: () => void;
  onSave: () => void;
  onDownloadBusinessCard: () => Promise<void>;
  onDownloadCV: () => Promise<void>;
}

export function VCardFooter({
  isEditing,
  isPdfGenerating,
  isProcessing,
  selectedStyle,
  onEditToggle,
  onSave,
  onDownloadBusinessCard,
  onDownloadCV,
}: VCardFooterProps) {
  return (
    <div className="flex justify-between items-center">
      <VCardActions
        isEditing={isEditing}
        isPdfGenerating={isPdfGenerating}
        isProcessing={isProcessing}
        setIsEditing={() => onEditToggle()}
        onSave={onSave}
        onDownloadBusinessPDF={onDownloadBusinessCard}
        onDownloadCVPDF={onDownloadCV}
        selectedStyle={selectedStyle}
      />
      
      <div className="p-2 glass-card group hover:scale-105 transition-transform duration-300">
        <QRCodeSVG
          value={window.location.href}
          size={85}
          level="H"
          includeMargin={false}
          className="rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </div>
  );
}