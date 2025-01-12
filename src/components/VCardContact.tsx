import { UserProfile } from "@/types/profile";

export interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
}

export function VCardContact({ profile, isEditing, setProfile, customStyles }: VCardContactProps) {
  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div style={{ fontFamily: customStyles?.font, backgroundColor: customStyles?.background, color: customStyles?.textColor }}>
      <h2 className="text-lg font-bold">Contact</h2>
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={profile.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Téléphone"
            className="w-full p-2 rounded border"
          />
          <input
            type="text"
            value={profile.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="Ville"
            className="w-full p-2 rounded border"
          />
          <input
            type="text"
            value={profile.state || ""}
            onChange={(e) => handleChange("state", e.target.value)}
            placeholder="État"
            className="w-full p-2 rounded border"
          />
          <input
            type="text"
            value={profile.country || ""}
            onChange={(e) => handleChange("country", e.target.value)}
            placeholder="Pays"
            className="w-full p-2 rounded border"
          />
          <input
            type="text"
            value={profile.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="Site web"
            className="w-full p-2 rounded border"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <p>Téléphone: {profile.phone}</p>
          <p>Ville: {profile.city}</p>
          <p>État: {profile.state}</p>
          <p>Pays: {profile.country}</p>
          <p>Site web: {profile.website}</p>
        </div>
      )}
    </div>
  );
}
