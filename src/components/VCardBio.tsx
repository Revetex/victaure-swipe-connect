import { Textarea } from "@/components/ui/textarea";
import { VCardSection } from "./VCardSection";
import { FileText } from "lucide-react";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { VCardButton } from "./vcard/VCardButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VCardBioProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  onGenerateBio?: () => void;
}

export function VCardBio({
  profile,
  isEditing,
  setProfile,
  onGenerateBio
}: VCardBioProps) {
  const { selectedStyle } = useVCardStyle();

  const handleGenerateBio = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get user's skills, experiences and education
      const { data: experiences } = await supabase
        .from('experiences')
        .select('*')
        .eq('profile_id', user.id);

      const { data: education } = await supabase
        .from('education')
        .select('*')
        .eq('profile_id', user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('skills')
        .eq('id', user.id)
        .single();

      const { data, error } = await supabase.functions.invoke('generate-bio', {
        body: {
          skills: profile?.skills || [],
          experiences: experiences || [],
          education: education || []
        }
      });

      if (error) throw error;

      if (data?.bio) {
        setProfile((prev: any) => ({ ...prev, bio: data.bio }));
        toast.success("Bio générée avec succès!");
      }
    } catch (error) {
      console.error('Error generating bio:', error);
      toast.error("Erreur lors de la génération de la bio");
    }
  };

  return (
    <VCardSection
      title="Bio"
      icon={<FileText className="h-5 w-5" style={{ color: selectedStyle.colors.primary }} />}
    >
      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Écrivez votre bio ici..."
              className="min-h-[150px] resize-none"
              style={{
                backgroundColor: `${selectedStyle.colors.primary}05`,
                borderColor: `${selectedStyle.colors.primary}30`,
                color: selectedStyle.colors.text.primary
              }}
            />
            <div className="flex gap-2 justify-end">
              <VCardButton
                onClick={handleGenerateBio}
                variant="outline"
                className="w-auto"
              >
                Générer avec M. Victaure
              </VCardButton>
            </div>
          </div>
        ) : (
          <p 
            className="whitespace-pre-wrap"
            style={{ color: selectedStyle.colors.text.primary }}
          >
            {profile.bio || "Aucune bio définie"}
          </p>
        )}
      </div>
    </VCardSection>
  );
}