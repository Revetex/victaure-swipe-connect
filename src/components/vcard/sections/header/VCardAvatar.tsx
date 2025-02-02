import { Upload, UserRound, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface VCardAvatarProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardAvatar({ profile, isEditing, setProfile }: VCardAvatarProps) {
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

      // Delete old avatar if it exists
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

  const handleDeleteAvatar = async () => {
    try {
      if (profile.avatar_url) {
        const fileName = profile.avatar_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('vcards')
            .remove([fileName]);
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Aucun utilisateur authentifié");

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: null })
          .eq('id', user.id);

        if (updateError) throw updateError;

        setProfile({ ...profile, avatar_url: null });
        toast.success("Photo de profil supprimée");
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast.error("Impossible de supprimer la photo de profil");
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
        <Avatar className="w-full h-full">
          <AvatarImage 
            src={profile.avatar_url} 
            alt={profile.full_name}
            className="object-cover w-full h-full"
          />
          <AvatarFallback className="bg-muted">
            <UserRound className="w-12 h-12 text-muted-foreground/50" />
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <label className="cursor-pointer p-2 rounded-full hover:bg-white/20 transition-colors">
              <Upload className="h-6 w-6 text-white" />
              <input
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
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                onClick={handleDeleteAvatar}
              >
                <Trash2 className="h-6 w-6 text-white" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}