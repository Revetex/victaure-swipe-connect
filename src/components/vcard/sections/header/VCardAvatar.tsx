import { Upload, UserRound } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useVCardStyle } from "../../VCardStyleContext";
import { UserProfile } from "@/types/profile";

interface VCardAvatarProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardAvatar({ profile, isEditing, setProfile }: VCardAvatarProps) {
  const { selectedStyle } = useVCardStyle();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!file.type.startsWith('image/')) {
        toast.error("Veuillez sélectionner une image");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5MB");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      // Delete old avatar if it exists
      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('vcards')
            .remove([oldFileName]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('vcards')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vcards')
        .getPublicUrl(fileName);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Aucun utilisateur authentifié");

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success("Photo de profil mise à jour");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Impossible de mettre à jour la photo de profil");
    }
  };

  return (
    <div className="relative group mx-auto sm:mx-0">
      <div 
        className={cn(
          "relative rounded-full overflow-hidden",
          "ring-4 transition-shadow duration-200",
          "w-24 h-24 sm:w-32 sm:h-32"
        )}
        style={{
          borderColor: `${selectedStyle.colors.primary}30`,
          boxShadow: `0 4px 12px ${selectedStyle.colors.primary}15`
        }}
      >
        <Avatar className="w-full h-full">
          <AvatarImage 
            src={profile.avatar_url} 
            alt={profile.full_name || "Photo de profil"}
            className="object-cover w-full h-full"
          />
          <AvatarFallback 
            className="bg-background/5 backdrop-blur-sm"
            style={{
              color: selectedStyle.colors.text.muted,
              background: `${selectedStyle.colors.primary}10`
            }}
          >
            <UserRound className="w-12 h-12" />
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <label 
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "bg-black/50 backdrop-blur-sm",
              "opacity-0 group-hover:opacity-100 cursor-pointer",
              "transition-all duration-200"
            )}
            htmlFor="avatar-upload"
          >
            <Upload className="h-8 w-8 text-white" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
}