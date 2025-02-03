import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Trash2, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

interface VCardAvatarProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  setIsAvatarDeleted: (deleted: boolean) => void;
}

export function VCardAvatar({ profile, isEditing, setProfile, setIsAvatarDeleted }: VCardAvatarProps) {
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

      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('vcards')
            .remove([oldFileName]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('vcards')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vcards')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });
      setIsAvatarDeleted(false);
      toast.success("Photo de profil mise à jour");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Impossible de mettre à jour la photo de profil");
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      if (profile.avatar_url) {
        const fileName = profile.avatar_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('vcards')
            .remove([fileName]);
        }
        setProfile({ ...profile, avatar_url: null });
        setIsAvatarDeleted(true);
        toast.success("Photo de profil supprimée");
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast.error("Impossible de supprimer la photo de profil");
    }
  };

  return (
    <div className="relative group shrink-0">
      <Avatar className="h-24 w-24 sm:h-28 sm:w-28 ring-2 ring-primary/20 shadow-lg">
        <AvatarImage 
          src={profile.avatar_url || ''} 
          alt={profile.full_name || ''}
          className="object-cover"
        />
        <AvatarFallback className="bg-primary/10">
          <UserCircle2 className="h-12 w-12 text-primary/60" />
        </AvatarFallback>
      </Avatar>
      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <label 
            className="flex items-center justify-center w-10 h-10 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200"
            htmlFor="avatar-upload"
          >
            <Upload className="h-5 w-5 text-white/90" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </label>
          {profile.avatar_url && (
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/40 transition-all duration-200"
              onClick={handleDeleteAvatar}
            >
              <Trash2 className="h-5 w-5 text-white/90" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}