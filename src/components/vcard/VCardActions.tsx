import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/profile";
import { generateVCardData } from "@/utils/profileActions";
import { toast } from "sonner";

interface VCardActionsProps {
  profile: UserProfile;
  onEdit?: () => void;
}

export function VCardActions({ profile, onEdit }: VCardActionsProps) {
  const handleDownloadVCard = () => {
    try {
      const vCardData = generateVCardData(profile);
      const blob = new Blob([vCardData], { type: 'text/vcard' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${profile.full_name || 'contact'}.vcf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("VCard téléchargée avec succès");
    } catch (error) {
      console.error('Error downloading vCard:', error);
      toast.error("Erreur lors du téléchargement de la VCard");
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <Button onClick={handleDownloadVCard} variant="outline">
        Télécharger VCard
      </Button>
      {onEdit && (
        <Button onClick={onEdit} variant="default">
          Modifier
        </Button>
      )}
    </div>
  );
}