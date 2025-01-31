import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { UserProfile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCardActions } from "./VCardActions";

interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  isPdfGenerating?: boolean;
  isProcessing?: boolean;
  onEditToggle?: () => void;
  onSave?: () => void;
  onDownloadBusinessCard?: () => Promise<void>;
  onDownloadCV?: () => Promise<void>;
}

export function VCardHeader({ 
  profile, 
  isEditing, 
  setProfile,
  isPdfGenerating,
  isProcessing,
  onEditToggle,
  onSave,
  onDownloadBusinessCard,
  onDownloadCV
}: VCardHeaderProps) {
  const { selectedStyle } = useVCardStyle();
  const isMobile = useIsMobile();

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
      className="relative p-4 sm:p-6 rounded-xl"
    >
      {/* Actions Row */}
      <div className={`${isMobile ? 'w-full' : 'shrink-0'} mb-6`}>
        <VCardActions
          isEditing={isEditing}
          isPdfGenerating={isPdfGenerating}
          isProcessing={isProcessing}
          setIsEditing={onEditToggle}
          onSave={onSave}
          onDownloadBusinessPDF={onDownloadBusinessCard}
          onDownloadCVPDF={onDownloadCV}
        />
      </div>

      {/* Profile Info Row */}
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
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
            <label 
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200"
              htmlFor="avatar-upload"
            >
              <Upload className="h-6 w-6 text-white/90" />
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

        <div className="flex-1 min-w-0 space-y-2">
          {isEditing ? (
            <>
              <Input
                value={profile.full_name || ""}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Votre nom"
                className="text-lg sm:text-xl font-medium bg-card/5 border-border/10 placeholder:text-muted-foreground/50"
              />
              <Input
                value={profile.role || ""}
                onChange={(e) => handleInputChange("role", e.target.value)}
                placeholder="Votre rôle"
                className="text-sm sm:text-base bg-card/5 border-border/10 placeholder:text-muted-foreground/50"
              />
            </>
          ) : (
            <>
              <h2 className="text-xl sm:text-2xl font-bold truncate text-primary">
                {profile.full_name || "Nom non défini"}
              </h2>
              <p className="text-sm sm:text-base text-primary/70">
                {profile.role || "Rôle non défini"}
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}