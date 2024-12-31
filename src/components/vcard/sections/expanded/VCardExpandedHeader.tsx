import { UserRound } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jobTitles } from "@/data/jobTitles";

interface VCardExpandedHeaderProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardExpandedHeader({ profile, isEditing, setProfile }: VCardExpandedHeaderProps) {
  const handleInputChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex items-center gap-6">
      <Avatar className="h-32 w-32 ring-4 ring-white/10 shadow-xl">
        <AvatarImage 
          src={profile.avatar_url} 
          alt={profile.full_name}
          className="object-cover"
        />
        <AvatarFallback className="bg-gray-800">
          <UserRound className="h-16 w-16 text-gray-400" />
        </AvatarFallback>
      </Avatar>
      <div className="space-y-4 flex-1">
        {isEditing ? (
          <>
            <Input
              value={profile.full_name || ""}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              className="text-2xl font-bold bg-gray-800/50 border-gray-700 text-white"
              placeholder="Votre nom"
            />
            <Select
              value={profile.role || ""}
              onValueChange={(value) => handleInputChange('role', value)}
            >
              <SelectTrigger className="w-full bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Sélectionnez un titre" />
              </SelectTrigger>
              <SelectContent>
                {jobTitles.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-white mb-2">
              {profile.full_name || "Nom non défini"}
            </h1>
            <p className="text-xl text-gray-300">
              {profile.role || "Rôle non défini"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}