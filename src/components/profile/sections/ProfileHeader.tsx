
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { X, Download, Mail, Phone, MapPin, Link } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useConnectionStatus } from "../preview/hooks/useConnectionStatus";
import { useConnectionActions } from "../preview/hooks/useConnectionActions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { generateCV } from "@/utils/pdfGenerator";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileHeaderProps {
  profile: UserProfile;
  onClose?: () => void;
  canViewFullProfile?: boolean;
}

export function ProfileHeader({ profile, onClose, canViewFullProfile = true }: ProfileHeaderProps) {
  const { profile: currentUserProfile } = useProfile();
  const isOwnProfile = currentUserProfile?.id === profile.id;
  const { isFriend, isFriendRequestReceived, isFriendRequestSent } = useConnectionStatus(profile.id);
  const { handleAddFriend, handleAcceptFriend, handleRemoveFriend } = useConnectionActions();
  const isMobile = useIsMobile();

  const handleDownloadCV = async () => {
    try {
      toast.loading("Génération de votre CV en cours...");
      
      // Ajoutons un style par défaut pour éviter l'erreur
      const defaultStyle = {
        id: "default",
        name: "Default",
        color: "#64B5D9",
        secondaryColor: "#1B2A4A",
        font: "Helvetica",
        bgGradient: "bg-gradient-to-r from-blue-50 to-blue-100",
        colors: {
          primary: "#64B5D9",
          secondary: "#1B2A4A",
          text: {
            primary: "#333333",
            secondary: "#666666",
            muted: "#999999"
          },
          background: {
            card: "#FFFFFF",
            section: "#F9FAFB",
            button: "#64B5D9"
          }
        }
      };
      
      const pdfBlob = await generateCV(profile, defaultStyle);
      if (!pdfBlob) {
        throw new Error("Erreur lors de la génération du PDF");
      }
      
      // Convertir le document PDF en Blob avant utilisation
      const pdfData = pdfBlob.output('blob');
      
      // Créer URL pour le téléchargement
      const pdfUrl = URL.createObjectURL(pdfData);
      
      // Créer un lien pour télécharger et le cliquer
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = `CV_${profile.full_name?.replace(/\s+/g, '_') || 'CV'}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Libérer l'URL
      URL.revokeObjectURL(pdfUrl);
      
      toast.dismiss();
      toast.success("CV téléchargé avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du CV:", error);
      toast.dismiss();
      toast.error("Erreur lors de la génération du CV");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-6 rounded-t-lg relative border-b border-border/20">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 sm:right-4 sm:top-4 text-muted-foreground hover:text-foreground z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center gap-4`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Avatar className={`${isMobile ? 'h-24 w-24' : 'h-20 w-20'} border-2 border-primary/20 shadow-md`}>
            <AvatarImage src={profile.avatar_url || ""} className="object-cover" />
            <AvatarFallback className="bg-primary/20 text-primary text-xl">
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>
          {profile.online_status && (
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
          )}
        </motion.div>

        <div className={`flex-1 space-y-2 ${isMobile ? 'text-center mt-2 w-full' : 'text-left'}`}>
          <div className={`flex ${isMobile ? 'flex-col items-center' : 'flex-row items-center'} gap-2`}>
            <h2 className="text-2xl font-bold">{profile.full_name}</h2>
            {profile.verified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="border-primary/20 text-primary">
                      Vérifié
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Profil vérifié par Victaure</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {profile.role && (
            <p className="text-muted-foreground">{profile.role}</p>
          )}

          {canViewFullProfile && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`flex flex-wrap gap-3 items-center ${isMobile ? 'justify-center' : 'justify-start'} text-sm text-muted-foreground mt-3`}
            >
              {profile.email && (
                <div className="flex items-center gap-1 bg-background/50 px-2 py-1 rounded-full">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="max-w-[180px] truncate">{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-1 bg-background/50 px-2 py-1 rounded-full">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {(profile.city || profile.state || profile.country) && (
                <div className="flex items-center gap-1 bg-background/50 px-2 py-1 rounded-full">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="max-w-[180px] truncate">
                    {[profile.city, profile.state, profile.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-1 bg-background/50 px-2 py-1 rounded-full">
                  <Link className="h-3.5 w-3.5" />
                  <a 
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline max-w-[180px] truncate"
                  >
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div className={`flex flex-wrap gap-2 ${isMobile ? 'justify-center mt-4' : 'justify-end mt-4'}`}>
        {isOwnProfile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-primary/10 hover:bg-primary/20 gap-1"
            onClick={handleDownloadCV}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Télécharger mon CV</span>
            <span className="sm:hidden">CV</span>
          </Button>
        )}

        {!isOwnProfile && (
          <>
            {isFriendRequestReceived && (
              <Button
                variant="outline"
                size="sm"
                className="bg-primary/10 hover:bg-primary/20"
                onClick={handleAcceptFriend}
              >
                <span className="hidden sm:inline">Accepter la demande</span>
                <span className="sm:hidden">Accepter</span>
              </Button>
            )}
            {isFriendRequestSent && (
              <Button
                variant="outline"
                size="sm"
                className="bg-muted hover:bg-muted/80"
                onClick={handleRemoveFriend}
              >
                <span className="hidden sm:inline">Annuler la demande</span>
                <span className="sm:hidden">Annuler</span>
              </Button>
            )}
            {!isFriend && !isFriendRequestReceived && !isFriendRequestSent && (
              <Button
                variant="outline"
                size="sm"
                className="bg-primary/10 hover:bg-primary/20"
                onClick={handleAddFriend}
              >
                <span className="hidden sm:inline">Ajouter</span>
                <span className="sm:hidden">Ajouter</span>
              </Button>
            )}
            {isFriend && (
              <Badge variant="outline" className="border-green-500/20 text-green-500 px-3 py-1">
                Connectés
              </Badge>
            )}
          </>
        )}
      </div>
    </div>
  );
}
