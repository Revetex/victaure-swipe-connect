import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Download, QrCode } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { VCardBadge } from "./VCardBadge";

interface VCardProps {
  profile: UserProfile;
  isPublicView?: boolean;
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCard({ profile, isPublicView = false, onEditStateChange, onRequestChat }: VCardProps) {
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">No profile data available</p>
      </div>
    );
  }

  const handleDownloadBusinessCard = async () => {
    try {
      // Implement PDF generation logic here
      toast.success("Business card downloaded successfully");
    } catch (error) {
      toast.error("Failed to download business card");
    }
  };

  const handleDownloadCV = async () => {
    try {
      // Implement CV generation logic here
      toast.success("CV downloaded successfully");
    } catch (error) {
      toast.error("Failed to download CV");
    }
  };

  return (
    <div className={cn(
      "vcard space-y-8 p-6 rounded-xl bg-background/95 backdrop-blur-sm border border-border/50",
      "shadow-lg hover:shadow-xl transition-all duration-300",
      isPublicView ? 'public' : 'private'
    )}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-primary tracking-tight">
            {profile.full_name || 'Unnamed Profile'}
          </h2>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsQRDialogOpen(true)}
              className="rounded-full"
            >
              <QrCode className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownloadBusinessCard}
              className="rounded-full"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <img 
            src={profile.avatar_url || '/default-avatar.png'} 
            alt={profile.full_name || 'Profile'} 
            className="w-24 h-24 rounded-full ring-2 ring-primary/20 shadow-md"
          />
          {profile.bio && (
            <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {profile.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Email:</span>
            {profile.email}
          </div>
        )}
        
        {profile.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Téléphone:</span>
            {profile.phone}
          </div>
        )}
        
        {(profile.city || profile.state || profile.country) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Localisation:</span>
            {[profile.city, profile.state, profile.country]
              .filter(Boolean)
              .join(", ")}
          </div>
        )}
      </div>

      {profile.skills && profile.skills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary/80">Compétences</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <VCardBadge key={index} text={skill} />
            ))}
          </div>
        </div>
      )}
      
      {profile.certifications && profile.certifications.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary/80">Certifications</h3>
          <ul className="space-y-2">
            {profile.certifications.map(cert => (
              <li key={cert.id} className="p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="font-medium text-foreground">{cert.title}</div>
                <div className="text-sm text-muted-foreground">
                  {cert.institution} ({cert.year})
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.education && profile.education.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary/80">Formation</h3>
          <ul className="space-y-2">
            {profile.education.map(edu => (
              <li key={edu.id} className="p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="font-medium text-foreground">{edu.degree}</div>
                <div className="text-sm text-muted-foreground">{edu.school_name}</div>
                {edu.start_date && (
                  <div className="text-xs text-muted-foreground">
                    {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.experiences && profile.experiences.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary/80">Expérience</h3>
          <ul className="space-y-2">
            {profile.experiences.map(exp => (
              <li key={exp.id} className="p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="font-medium text-foreground">{exp.position}</div>
                <div className="text-sm text-muted-foreground">
                  {exp.company} ({exp.start_date ? new Date(exp.start_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : ''} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : 'Present'})
                </div>
                {exp.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center space-y-4 p-6">
            <QRCodeSVG
              value={window.location.href}
              size={200}
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
    </div>
  );
}