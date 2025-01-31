import { Mail, Phone, MapPin } from "lucide-react";
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4 sm:p-6 rounded-xl bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-gray-200/10 dark:border-white/5"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white/90">Contact</h3>
        <motion.div 
          className="cursor-pointer"
          onClick={() => setIsQRDialogOpen(true)}
          whileHover={{ scale: 1.05 }}
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
      </div>
      
      <div className="space-y-2">
        {profile.email && (
          <motion.div 
            className="flex items-center gap-3 p-2 rounded-lg bg-white/5 dark:bg-black/20 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.01 }}
          >
            <Mail className="h-4 w-4 text-gray-600 dark:text-white/70" />
            <a 
              href={`mailto:${profile.email}`} 
              className="text-sm text-gray-700 dark:text-white/80 hover:text-primary dark:hover:text-white transition-colors"
            >
              {profile.email}
            </a>
          </motion.div>
        )}
        {profile.phone && (
          <motion.div 
            className="flex items-center gap-3 p-2 rounded-lg bg-white/5 dark:bg-black/20 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.01 }}
          >
            <Phone className="h-4 w-4 text-gray-600 dark:text-white/70" />
            <a 
              href={`tel:${profile.phone}`} 
              className="text-sm text-gray-700 dark:text-white/80 hover:text-primary dark:hover:text-white transition-colors"
            >
              {profile.phone}
            </a>
          </motion.div>
        )}
        {(profile.city || profile.state) && (
          <motion.div 
            className="flex items-center gap-3 p-2 rounded-lg bg-white/5 dark:bg-black/20 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.01 }}
          >
            <MapPin className="h-4 w-4 text-gray-600 dark:text-white/70" />
            <span className="text-sm text-gray-700 dark:text-white/80">
              {[profile.city, profile.state].filter(Boolean).join(", ")}
            </span>
          </motion.div>
        )}
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