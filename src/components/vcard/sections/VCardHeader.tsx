import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { VCardHeader as BaseVCardHeader } from "../VCardHeader";
import { VCardContactInfo } from "../VCardContactInfo";

interface VCardHeaderProps {
  tempProfile: any;
  isEditing: boolean;
  setTempProfile: (profile: any) => void;
  setIsEditing: (isEditing: boolean) => void;
  isExpanded: boolean;
}

export function VCardHeaderSection({
  tempProfile,
  isEditing,
  setTempProfile,
  setIsEditing,
  isExpanded
}: VCardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
      <div className="flex-1 min-w-0">
        <BaseVCardHeader
          profile={tempProfile}
          isEditing={isEditing}
          setProfile={setTempProfile}
          setIsEditing={setIsEditing}
        />

        {!isExpanded && (
          <VCardContactInfo
            email={tempProfile.email}
            phone={tempProfile.phone}
            city={tempProfile.city}
            state={tempProfile.state}
          />
        )}
      </div>

      {!isExpanded && (
        <div className="shrink-0 sm:ml-4">
          <QRCodeSVG
            value={window.location.href}
            size={80}
            level="H"
            includeMargin={true}
            className="bg-white p-1.5 rounded-lg shadow-sm"
          />
        </div>
      )}
    </div>
  );
}