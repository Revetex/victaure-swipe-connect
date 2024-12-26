import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";

interface VCardContactProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-victaure-gray-dark">Email</p>
          {isEditing ? (
            <Input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          ) : (
            <p>{profile.email}</p>
          )}
        </div>
        <div>
          <p className="text-sm text-victaure-gray-dark">Téléphone</p>
          {isEditing ? (
            <Input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          ) : (
            <p>{profile.phone}</p>
          )}
        </div>
      </div>
      <div className="bg-white p-2 rounded-lg shadow-sm">
        <QRCodeSVG
          value={window.location.href}
          size={120}
          level="H"
          includeMargin={true}
        />
      </div>
    </div>
  );
}