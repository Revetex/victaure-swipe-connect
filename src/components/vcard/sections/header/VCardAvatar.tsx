import { Upload, UserRound } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile } from "@/types/profile";

interface VCardAvatarProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardAvatar({ profile, isEditing, setProfile }: VCardAvatarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (profile.avatar_url) {
      // Précharger l'image pour vérifier si elle est valide
      const img = new Image();
      img.src = profile.avatar_url;
      img.onload = () => setImageError(false);
      img.onerror = () => setImageError(true);
    }
  }, [profile.avatar_url]);

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

      setIsLoading(true);
      setImageError(false);

      // Nettoyer l'ancienne image si elle existe
      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('vcards')
            .remove([oldFileName]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('vcards')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vcards')
        .getPublicUrl(fileName);

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success("Photo de profil mise à jour");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setImageError(true);
      toast.error("Impossible de mettre à jour la photo de profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group mx-auto sm:mx-0">
      <div className={cn(
        "relative rounded-full overflow-hidden",
        "ring-4 ring-background dark:ring-background/80",
        "shadow-xl hover:shadow-2xl transition-shadow duration-200",
        "w-24 h-24 sm:w-32 sm:h-32"
      )}>
        {isLoading ? (
          <Skeleton className="w-full h-full rounded-full animate-pulse" />
        ) : (
          <Avatar className="w-full h-full">
            <AvatarImage 
              src={imageError ? undefined : profile.avatar_url}
              alt={profile.full_name || "Photo de profil"}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
            />
            <AvatarFallback className="bg-muted">
              <UserRound className="w-12 h-12 text-muted-foreground/50" />
            </AvatarFallback>
          </Avatar>
        )}
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