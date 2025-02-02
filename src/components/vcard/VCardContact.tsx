import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/types/profile";

interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  onUpdate: (field: keyof UserProfile, value: any) => void;
}

export const VCardContact = ({ profile, isEditing, onUpdate }: VCardContactProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="city">Ville</Label>
        {isEditing ? (
          <Input
            id="city"
            value={profile.city || ""}
            onChange={(e) => onUpdate("city", e.target.value)}
            placeholder="Entrez votre ville"
            className="mt-1"
          />
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {profile.city || "Non spécifié"}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="state">Province</Label>
        {isEditing ? (
          <Input
            id="state"
            value={profile.state || ""}
            onChange={(e) => onUpdate("state", e.target.value)}
            placeholder="Entrez votre province"
            className="mt-1"
          />
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {profile.state || "Non spécifié"}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="country">Pays</Label>
        {isEditing ? (
          <Input
            id="country"
            value={profile.country || "Canada"}
            onChange={(e) => onUpdate("country", e.target.value)}
            placeholder="Entrez votre pays"
            className="mt-1"
          />
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {profile.country || "Canada"}
          </p>
        )}
      </div>
    </div>
  );
};