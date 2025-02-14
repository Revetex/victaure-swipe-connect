
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/business';
import { toast } from 'sonner';

export function useBusinessProfile() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['businessProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as BusinessProfile;
    }
  });

  const createProfile = useMutation({
    mutationFn: async (profileData: Partial<BusinessProfile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('business_profiles')
        .insert([{ id: user.id, ...profileData }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessProfile'] });
      toast.success('Profil entreprise créé avec succès');
    },
    onError: (error) => {
      console.error('Error creating business profile:', error);
      toast.error('Erreur lors de la création du profil');
    }
  });

  const updateProfile = useMutation({
    mutationFn: async (profileData: Partial<BusinessProfile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('business_profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessProfile'] });
      toast.success('Profil mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating business profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  });

  return {
    profile,
    isLoading,
    createProfile,
    updateProfile
  };
}
