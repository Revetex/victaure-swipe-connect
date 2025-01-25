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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4"
    >
      <div className="relative group">
        <Avatar className="h-24 w-24 ring-2 ring-white/20 shrink-0">
          <AvatarImage 
            src={profile.avatar_url || ''} 
            alt={profile.full_name || ''}
            className="object-cover w-full h-full"
          />
          <AvatarFallback className="bg-[#1A1F2C]">
            <UserCircle2 className="h-14 w-14 text-white" />
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <label 
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200"
            htmlFor="avatar-upload"
          >
            <Upload className="h-6 w-6 text-white" />
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

      <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={profile.full_name || ""}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              placeholder="Votre nom"
              className="text-xl font-semibold bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Input
              value={profile.role || ""}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="Votre rôle"
              className="text-sm bg-white/10 border-white/20 text-white/90 placeholder:text-white/50"
            />
          </div>
        ) : (
          <>
            <h2 
              className="text-xl sm:text-2xl font-semibold truncate transition-colors"
              style={{ 
                color: selectedStyle.colors.text.primary,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {profile.full_name || "Nom non défini"}
            </h2>
            <p 
              className="text-sm sm:text-base transition-colors"
              style={{ 
                color: selectedStyle.colors.text.secondary,
                textShadow: '0 1px 1px rgba(0,0,0,0.05)'
              }}
            >
              {profile.role || "Rôle non défini"}
            </p>
          </>
        )}
      </div>

      {!isEditing && (
        <motion.div 
          className="shrink-0 cursor-pointer"
          onClick={() => setIsQRDialogOpen(true)}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-2 glass-card">
            <QRCodeSVG
              value={window.location.href}
              size={80}
              level="H"
              includeMargin={false}
              className="rounded-lg opacity-80 hover:opacity-100 transition-opacity duration-300"
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