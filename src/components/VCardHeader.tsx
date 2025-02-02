import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2, Upload, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { UserProfile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { VCardActions } from "./VCardActions";
import { Button } from "./ui/button";

interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  isPdfGenerating?: boolean;
  isProcessing?: boolean;
  onEditToggle?: () => void;
  onSave?: () => void;
  onDownloadBusinessCard?: () => Promise<void>;
}

export function VCardHeader({ 
  profile, 
  isEditing, 
  setProfile,
  isProcessing,
  onEditToggle,
  onSave,
  onDownloadBusinessCard,
}: VCardHeaderProps) {
  const { selectedStyle } = useVCardStyle();
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false);

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

  const handleSave = async () => {
    if (onSave) {
      // Ensure avatar_url is explicitly set to null if it was deleted
      if (isAvatarDeleted) {
        setProfile({ ...profile, avatar_url: null });
      }
      await onSave();
      setIsAvatarDeleted(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-4 sm:p-6 rounded-xl"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
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

        <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left w-full">
          {isEditing ? (
            <div className="space-y-3 w-full">
              <Input
                value={profile.full_name || ""}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Votre nom"
                className="text-lg sm:text-xl font-medium bg-card/5 border-border/10 placeholder:text-muted-foreground/50 w-full"
              />
              <Input
                value={profile.role || ""}
                onChange={(e) => handleInputChange("role", e.target.value)}
                placeholder="Votre rôle"
                className="text-sm sm:text-base bg-card/5 border-border/10 placeholder:text-muted-foreground/50 w-full"
              />
            </div>
          ) : (
            <div className="space-y-1">
              {profile.full_name && (
                <h2 className="text-xl sm:text-2xl font-bold truncate text-primary">
                  {profile.full_name}
                </h2>
              )}
              {profile.role && (
                <p className="text-sm sm:text-base text-primary/70">
                  {profile.role}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          {!isEditing && (
            <motion.div 
              className="shrink-0 cursor-pointer"
              onClick={() => setIsQRDialogOpen(true)}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-2 sm:p-3 bg-card/5 backdrop-blur-md rounded-xl border border-border/10 shadow-sm">
                <QRCodeSVG
                  value={window.location.href}
                  size={60}
                  level="H"
                  includeMargin={false}
                  className="rounded-lg opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </motion.div>
          )}
          
          <div className="shrink-0">
            <VCardActions
              isEditing={isEditing}
              isProcessing={isProcessing}
              setIsEditing={onEditToggle}
              onSave={handleSave}
              onDownloadBusinessCard={onDownloadBusinessCard}
            />
          </div>
        </div>
      </div>

      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-sm border-none">
          <div className="flex flex-col items-center space-y-4 p-6">
            <QRCodeSVG
              value={window.location.href}
              size={200}
              level="H"
              includeMargin={true}
              className="rounded-lg"
            />
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              Scannez ce code QR pour accéder à mon profil professionnel
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}