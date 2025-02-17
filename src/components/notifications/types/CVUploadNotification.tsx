
import { useState } from "react";
import { UserProfile, createEmptyProfile } from "@/types/profile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, User } from "lucide-react";
import { VProfile } from "@/components/VProfile";

interface CVUploadNotificationProps {
  id: string;
  message: string;
  onDelete: (id: string) => void;
}

export function CVUploadNotification({ id, message, onDelete }: CVUploadNotificationProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handleProfileUpdate = async (newProfileData: any) => {
    try {
      const { data: certifications } = await supabase
        .from('certifications')
        .select('*')
        .eq('profile_id', newProfileData.id);

      const { data: education } = await supabase
        .from('education')
        .select('*')
        .eq('profile_id', newProfileData.id);

      const { data: experiences } = await supabase
        .from('experiences')
        .select('*')
        .eq('profile_id', newProfileData.id);

      const updatedProfile: UserProfile = {
        ...createEmptyProfile(newProfileData.id || '', newProfileData.email || ''),
        ...newProfileData,
        role: (newProfileData.role as 'professional' | 'business' | 'admin') || 'professional',
        certifications: certifications || [],
        education: education || [],
        experiences: experiences || [],
        friends: []
      };

      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const requesterId = message.match(/ID:(\S+)/)?.[1];
      if (!requesterId) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('vcards')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vcards')
        .getPublicUrl(fileName);

      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: requesterId,
          title: 'CV reçu',
          message: `Un CV a été partagé avec vous. ${publicUrl}`,
        });

      if (notifError) throw notifError;
      
      toast.success("CV envoyé avec succès");
      onDelete(id);
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error("Erreur lors de l'envoi du CV");
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewProfile = async () => {
    try {
      const requesterId = message.match(/ID:(\S+)/)?.[1];
      if (!requesterId) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', requesterId)
        .single();

      if (error) throw error;

      await handleProfileUpdate(data);
      setShowProfile(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Erreur lors du chargement du profil");
    }
  };

  return (
    <>
      <div className="flex gap-2 mt-3">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => document.getElementById('cv-upload')?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Envoi...' : 'Joindre CV'}
        </Button>
        <input
          id="cv-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={handleViewProfile}
        >
          <User className="h-4 w-4" />
          Voir le profil
        </Button>
      </div>

      {profile && (
        <VProfile
          profile={profile}
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}
