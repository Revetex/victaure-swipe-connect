
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FormData } from './types';

export function useBusinessSignup(redirectTo?: string) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    companyName: '',
    phone: '',
    industry: '',
    companySize: '',
    province: '',
    address: '',
    postalCode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('business_profiles')
          .insert({
            id: authData.user.id,
            company_name: formData.companyName,
            industry: formData.industry,
            company_size: formData.companySize,
            phone: formData.phone,
            province: formData.province,
            address: formData.address,
            postal_code: formData.postalCode,
            email: formData.email,
            subscription_status: 'trial'
          });

        if (profileError) throw profileError;

        toast.success('Compte entreprise créé avec succès');
        navigate(redirectTo || '/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erreur lors de la création du compte");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    handleSubmit
  };
}
