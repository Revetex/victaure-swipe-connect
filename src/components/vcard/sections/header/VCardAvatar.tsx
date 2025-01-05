import { Upload, UserRound } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface VCardAvatarProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardAvatar({ profile, isEditing, setProfile }: VCardAvatarProps) {
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Veuillez sélectionner une image",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
        });
        return;
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
      
      toast({
        title: "Succès",
        description: "Photo de profil mise à jour",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la photo de profil",
      });
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