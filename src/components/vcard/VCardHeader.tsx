import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Upload, UserCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";

interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  selectedStyle: any;
  onProfileUpdate: (updates: Partial<UserProfile>) => void;
}

export function VCardHeader({ profile, isEditing, selectedStyle, onProfileUpdate }: VCardHeaderProps) {
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    onProfileUpdate({ [field]: value });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 2MB");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${profile.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vcards')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vcards')
        .getPublicUrl(filePath);

      onProfileUpdate({ avatar_url: publicUrl });
      toast.success("Photo de profil mise à jour");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Erreur lors de l'upload de l'image");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center sm:items-start gap-6 p-6"
    >
      <div className="relative group w-32 h-32 mx-auto sm:mx-0">
        <Avatar className="w-full h-full ring-4 ring-background/80 shadow-xl">
          <AvatarImage 
            src={profile.avatar_url || ''} 
            alt={profile.full_name || ''}
            className="object-cover"
          />
          <AvatarFallback className="bg-muted">
            <UserCircle2 className="w-12 h-12 text-muted-foreground/50" />
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
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="text-center sm:text-left space-y-2 w-full">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={profile.full_name || ""}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              placeholder="Votre nom"
              className="text-xl font-semibold bg-background/50 border-border/50"
            />
            <Input
              value={profile.role || ""}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="Votre rôle"
              className="text-sm bg-background/50 border-border/50"
            />
          </div>
        ) : (
          <>
            <h2 
              className="text-2xl font-semibold truncate"
              style={{ 
                color: selectedStyle.colors.text.primary,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {profile.full_name || "Nom non défini"}
            </h2>
            <p 
              className="text-base"
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
          className="mt-4 w-full max-w-[200px] mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setIsQRDialogOpen(true)}
        >
          <div className="p-4 glass-card hover:scale-105 transition-transform duration-300 cursor-pointer">
            <QRCodeSVG
              value={window.location.href}
              size={160}
              level="H"
              includeMargin={false}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </motion.div>
      )}

      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center space-y-4 p-6">
            <QRCodeSVG
              value={window.location.href}
              size={256}
              level="H"
              includeMargin
              className="rounded-xl"
            />
            <p className="text-sm text-muted-foreground">
              Scannez ce QR code pour partager votre profil
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}