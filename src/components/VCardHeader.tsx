import { UserProfile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { UserRound, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
}

export function VCardHeader({ profile, isEditing, setProfile, customStyles }: VCardHeaderProps) {
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

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success("Photo de profil mise à jour");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Impossible de mettre à jour la photo de profil");
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col items-center text-center p-6 rounded-lg border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "md:flex-row md:text-left md:items-start md:gap-6"
      )}
      style={{
        fontFamily: customStyles?.font,
        backgroundColor: customStyles?.background,
        color: customStyles?.textColor,
      }}
    >
      <div className="relative group mx-auto sm:mx-0">
        <div className={cn(
          "relative rounded-full overflow-hidden",
          "ring-4 ring-background dark:ring-background/80",
          "shadow-xl hover:shadow-2xl transition-shadow duration-200",
          "w-24 h-24 sm:w-32 sm:h-32"
        )}>
          <Avatar className="w-full h-full">
            <AvatarImage 
              src={profile.avatar_url || ""} 
              alt={profile.full_name || ""}
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="bg-muted">
              <UserRound className="w-12 h-12 text-muted-foreground/50" />
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
      
      <div className="mt-4 md:mt-0 space-y-2">
        <h1 className={cn(
          "text-2xl font-bold tracking-tight",
          customStyles?.textColor ? "" : "text-foreground"
        )}>
          {profile.full_name || "Sans nom"}
        </h1>
        {profile.role && (
          <p className={cn(
            "text-lg",
            customStyles?.textColor ? "opacity-80" : "text-muted-foreground"
          )}>
            {profile.role}
          </p>
        )}
      </div>
    </div>
  );
}