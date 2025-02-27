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

  const handleDownloadCV = async () => {
    try {
      toast.loading("Génération de votre CV en cours...");
      
      const pdfBlob = await generateCV(profile);
      if (!pdfBlob) {
        throw new Error("Erreur lors de la génération du PDF");
      }
      
      // Créer URL pour le téléchargement
      const pdfUrl = URL.createObjectURL(new Blob([pdfBlob]));
      
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
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-t-lg relative border-b border-border/20">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="h-20 w-20 border-2 border-primary/20">
          <AvatarImage src={profile.avatar_url || ""} />
          <AvatarFallback className="bg-primary/20 text-primary text-xl">
            {getInitials(profile.full_name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
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
              className="flex flex-wrap gap-3 items-center justify-center sm:justify-start text-sm text-muted-foreground"
            >
              {profile.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {(profile.city || profile.state || profile.country) && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {[profile.city, profile.state, profile.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-1">
                  <Link className="h-3.5 w-3.5" />
                  <a 
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center sm:justify-end mt-4">
        {isOwnProfile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-primary/10 hover:bg-primary/20 gap-1"
            onClick={handleDownloadCV}
          >
            <Download className="h-4 w-4" />
            Télécharger mon CV
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
                Accepter la demande
              </Button>
            )}
            {isFriendRequestSent && (
              <Button
                variant="outline"
                size="sm"
                className="bg-muted hover:bg-muted/80"
                onClick={handleRemoveFriend}
              >
                Annuler la demande
              </Button>
            )}
            {!isFriend && !isFriendRequestReceived && !isFriendRequestSent && (
              <Button
                variant="outline"
                size="sm"
                className="bg-primary/10 hover:bg-primary/20"
                onClick={handleAddFriend}
              >
                Ajouter
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
