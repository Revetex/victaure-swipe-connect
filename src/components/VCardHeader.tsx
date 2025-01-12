import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { UserProfile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardHeader({ profile, isEditing, setProfile }: VCardHeaderProps) {
  const { selectedStyle } = useVCardStyle();
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

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

  const textColor = profile.custom_text_color || selectedStyle.colors.text.primary;
  const secondaryTextColor = profile.custom_text_color || selectedStyle.colors.text.secondary;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-xl"
      style={{ 
        fontFamily: profile.custom_font || selectedStyle.font,
        color: textColor,
        background: profile.custom_background || `${selectedStyle.colors.primary}05`,
      }}
    >
      <div className="relative group">
        <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl">
          <AvatarImage 
            src={profile.avatar_url || ''} 
            alt={profile.full_name || ''}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10">
            <UserCircle2 className="h-16 w-16 text-primary" />
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <label 
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300"
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

      <div className="flex-1 min-w-0 space-y-4 text-center sm:text-left">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={profile.full_name || ""}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              placeholder="Votre nom"
              className="text-xl font-semibold bg-background/50 backdrop-blur-sm border-primary/20 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
              style={{ 
                fontFamily: profile.custom_font || selectedStyle.font,
                color: textColor
              }}
            />
            <Input
              value={profile.role || ""}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="Votre rôle"
              className="text-base bg-background/50 backdrop-blur-sm border-primary/20 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
              style={{ 
                fontFamily: profile.custom_font || selectedStyle.font,
                color: secondaryTextColor
              }}
            />
          </div>
        ) : (
          <>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ 
                color: textColor,
                fontFamily: profile.custom_font || selectedStyle.font,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {profile.full_name || "Nom non défini"}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg"
              style={{ 
                color: secondaryTextColor,
                fontFamily: profile.custom_font || selectedStyle.font,
                textShadow: '0 1px 1px rgba(0,0,0,0.05)'
              }}
            >
              {profile.role || "Rôle non défini"}
            </motion.p>
          </>
        )}
      </div>

      {!isEditing && (
        <motion.div 
          className="shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => setIsQRDialogOpen(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-3 rounded-xl bg-background/50 backdrop-blur-sm shadow-lg border border-primary/10">
            <QRCodeSVG
              value={window.location.href}
              size={80}
              level="H"
              includeMargin={false}
              className="rounded-lg opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </motion.div>
      )}

      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-sm border-none">
          <div className="flex flex-col items-center space-y-4 p-6">
            <QRCodeSVG
              value={window.location.href}
              size={250}
              level="H"
              includeMargin={true}
              className="rounded-lg"
            />
            <p className="text-sm text-muted-foreground text-center">
              Scannez ce code QR pour accéder à mon profil professionnel
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}