
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/business';
import { toast } from 'sonner';

type CreateBusinessProfileData = Omit<BusinessProfile, 'id' | 'created_at' | 'subscription_status' | 'verified'> & {
  subscription_status?: 'trial' | 'active' | 'expired' | 'cancelled';
  verified?: boolean;
};

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
    mutationFn: async (profileData: CreateBusinessProfileData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('business_profiles')
        .insert({
          id: user.id,
          company_name: profileData.company_name,
          industry: profileData.industry,
          company_size: profileData.company_size,
          description: profileData.description,
          website: profileData.website,
          logo_url: profileData.logo_url,
          location: profileData.location,
          subscription_status: 'trial',
          verified: false
        })
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
