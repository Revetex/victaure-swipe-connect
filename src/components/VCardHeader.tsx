import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { UserProfile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardHeader({ profile, isEditing, setProfile }: VCardHeaderProps) {
  const { selectedStyle } = useVCardStyle();

  const handleInputChange = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

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
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('vcards')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vcards')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success("Photo de profil mise à jour");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Impossible de mettre à jour la photo de profil");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4"
    >
      <div className="relative group">
        <Avatar className="h-20 w-20 ring-2 ring-white/20 shrink-0">
          <AvatarImage 
            src={profile.avatar_url || ''} 
            alt={profile.full_name || ''}
            className="object-cover w-full h-full"
          />
          <AvatarFallback className="bg-muted">
            <UserCircle2 className="h-12 w-12 text-muted-foreground" />
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

      <div className="flex-1 min-w-0 space-y-1">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={profile.full_name || ""}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              placeholder="Votre nom complet"
              className="text-xl font-semibold bg-white/10 border-white/20 text-white placeholder:text-white/50"
              style={{ color: '#1A1F2C' }}
            />
            <Input
              value={profile.role || ""}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="Votre rôle"
              className="text-sm bg-white/10 border-white/20 text-white/90 placeholder:text-white/50"
              style={{ color: '#221F26' }}
            />
          </div>
        ) : (
          <>
            <h2 
              className="text-xl font-semibold truncate"
              style={{ color: '#1A1F2C' }}
            >
              {profile.full_name || "Nom non défini"}
            </h2>
            <p 
              className="text-sm"
              style={{ color: '#221F26' }}
            >
              {profile.role || "Rôle non défini"}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}