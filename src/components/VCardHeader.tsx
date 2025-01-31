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
      className="relative p-6 rounded-xl"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative group">
          <Avatar className="h-32 w-32 ring-4 ring-[#9b87f5]/20 shadow-xl">
            <AvatarImage 
              src={profile.avatar_url || ''} 
              alt={profile.full_name || ''}
              className="object-cover"
            />
            <AvatarFallback className="bg-[#9b87f5]/20">
              <UserCircle2 className="h-16 w-16 text-[#9b87f5]" />
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <label 
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200"
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
            <>
              <Input
                value={profile.full_name || ""}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Votre nom"
                className="text-2xl font-semibold bg-background/10 border-border/20 placeholder:text-muted-foreground/50"
              />
              <Input
                value={profile.role || ""}
                onChange={(e) => handleInputChange("role", e.target.value)}
                placeholder="Votre rôle"
                className="text-base bg-background/10 border-border/20 placeholder:text-muted-foreground/50"
              />
            </>
          ) : (
            <>
              <h2 
                className="text-3xl sm:text-4xl font-bold truncate transition-colors text-[#9b87f5] dark:text-[#b4a4f7]"
              >
                {profile.full_name || "Nom non défini"}
              </h2>
              <p 
                className="text-lg sm:text-xl transition-colors text-[#7E69AB] dark:text-[#9b87f5]"
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
            <div className="p-3 bg-background/10 backdrop-blur-md rounded-xl border border-border/20 shadow-lg">
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
      </div>

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