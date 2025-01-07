import { QRCodeSVG } from "qrcode.react";
import { VCardActions } from "./VCardActions";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "./types";

interface VCardFooterProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  isProcessing: boolean; // Added this prop
  profile: UserProfile;
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
  profile,
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
        profile={profile}
        selectedStyle={selectedStyle}
        onEditToggle={onEditToggle}
        onSave={onSave}
        onDownloadBusinessCard={async () => {
          await onDownloadBusinessCard();
        }}
        onDownloadCV={async () => {
          await onDownloadCV();
        }}
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