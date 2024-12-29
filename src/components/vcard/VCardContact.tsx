import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VCardSuggestedResponses } from "./VCardSuggestedResponses";
import { useState } from "react";

interface VCardContactProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const [bioText, setBioText] = useState(profile.bio || "");

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value;
    setBioText(newBio);
    setProfile({ ...profile, bio: newBio });
  };

  const handleSuggestionSelect = (text: string) => {
    setBioText(text);
    setProfile({ ...profile, bio: text });
  };

  return (
    <div className="space-y-4">
      {isEditing ? (
        <>
          <div className="space-y-2">
            <Input
              placeholder="Email"
              value={profile.email || ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Téléphone"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Ville"
              value={profile.city || ""}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="État/Province"
              value={profile.state || ""}
              onChange={(e) => setProfile({ ...profile, state: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Bio"
              value={bioText}
              onChange={handleBioChange}
              className="min-h-[100px]"
            />
            <VCardSuggestedResponses
              inputText={bioText}
              onSelectSuggestion={handleSuggestionSelect}
            />
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {profile.email && (
            <p className="text-sm">
              <span className="font-medium">Email:</span> {profile.email}
            </p>
          )}
          {profile.phone && (
            <p className="text-sm">
              <span className="font-medium">Téléphone:</span> {profile.phone}
            </p>
          )}
          {profile.city && (
            <p className="text-sm">
              <span className="font-medium">Ville:</span> {profile.city}
            </p>
          )}
          {profile.state && (
            <p className="text-sm">
              <span className="font-medium">État/Province:</span> {profile.state}
            </p>
          )}
          {profile.bio && (
            <p className="text-sm">
              <span className="font-medium">Bio:</span> {profile.bio}
            </p>
          )}
        </div>
      )}
    </div>
  );
}