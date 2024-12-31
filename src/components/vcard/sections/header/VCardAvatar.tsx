import { Upload, UserRound } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      // Validate file type and size
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

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('vcards')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vcards')
        .getPublicUrl(fileName);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local state
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
      <Avatar className="h-16 w-16 ring-2 ring-background">
        <AvatarImage 
          src={profile.avatar_url} 
          alt={profile.full_name}
          className="object-cover"
        />
        <AvatarFallback className="bg-muted">
          <UserRound className="h-6 w-6 text-muted-foreground/50" />
        </AvatarFallback>
      </Avatar>
      {isEditing && (
        <label 
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200"
          htmlFor="avatar-upload"
        >
          <Upload className="h-5 w-5 text-white" />
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
  );
}