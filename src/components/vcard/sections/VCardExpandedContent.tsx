import { VCardActions } from "@/components/VCardActions";
import { VCardBio } from "@/components/VCardBio";
import { VCardCertifications } from "@/components/VCardCertifications";
import { VCardContact } from "@/components/VCardContact";
import { VCardEducation } from "@/components/VCardEducation";
import { VCardExperience } from "@/components/VCardExperience";
import { VCardHeader } from "@/components/VCardHeader";
import { VCardSkills } from "@/components/VCardSkills";
import { UserProfile } from "@/types/profile";
import { generateBusinessCard, generateCV } from "@/utils/pdfGenerator";
import { toast } from "sonner";

interface VCardExpandedContentProps {
  profile: UserProfile;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExpandedContent({ 
  profile, 
  isEditing, 
  setIsEditing,
  setProfile 
}: VCardExpandedContentProps) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Profil de ${profile.full_name}`,
          text: `Découvrez le profil professionnel de ${profile.full_name}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Lien copié dans le presse-papier");
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error("Erreur lors du partage");
    }
  };

  const handleSave = async () => {
    try {
      // Save logic will be handled by parent component
      toast.success("Modifications sauvegardées");
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving:', error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleApplyChanges = async () => {
    try {
      // Apply changes logic will be handled by parent component
      toast.success("Changements appliqués");
    } catch (error) {
      console.error('Error applying changes:', error);
      toast.error("Erreur lors de l'application des changements");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    if (!profile.skills) return;
    const newSkills = profile.skills.filter(s => s !== skill);
    setProfile({ ...profile, skills: newSkills });
  };

  return (
    <div className="space-y-8">
      <VCardActions
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onShare={handleShare}
        onDownloadBusinessPDF={async () => {
          try {
            const doc = await generateBusinessCard(profile);
            doc.save(`carte-visite-${profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'professionnel'}.pdf`);
            toast.success("Carte de visite générée avec succès");
          } catch (error) {
            console.error('Error generating business card:', error);
            toast.error("Erreur lors de la génération de la carte de visite");
          }
        }}
        onDownloadCVPDF={async () => {
          try {
            const doc = await generateCV(profile);
            doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'cv'}.pdf`);
            toast.success("CV généré avec succès");
          } catch (error) {
            console.error('Error generating CV:', error);
            toast.error("Erreur lors de la génération du CV");
          }
        }}
        onSave={handleSave}
        onApplyChanges={handleApplyChanges}
      />

      <VCardHeader
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <VCardBio
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />

          <VCardExperience
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />

          <VCardEducation
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />

          <VCardCertifications
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        </div>

        <div className="space-y-8">
          <VCardContact
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />

          <VCardSkills
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
            handleRemoveSkill={handleRemoveSkill}
          />
        </div>
      </div>
    </div>
  );
}