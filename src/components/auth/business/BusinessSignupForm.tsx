
import React from 'react';
import { BusinessFormHeader } from './BusinessFormHeader';
import { CompanyInfoFields } from './CompanyInfoFields';
import { CompanyDetailsFields } from './CompanyDetailsFields';
import { ContactFields } from './ContactFields';
import { SubmitButton } from './SubmitButton';
import { useBusinessSignup } from './useBusinessSignup';
import { BusinessSignupFormProps } from './types';
import { FormSection } from './FormSection';
import { Card } from '@/components/ui/card';

export function BusinessSignupForm({ redirectTo }: BusinessSignupFormProps) {
  const { formData, setFormData, loading, handleSubmit } = useBusinessSignup(redirectTo);

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 space-y-8 bg-card/50 backdrop-blur-sm border-primary/10">
      <BusinessFormHeader />
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormSection 
          title="Informations de l'entreprise"
          description="Entrez les informations principales de votre entreprise"
        >
          <CompanyInfoFields 
            formData={formData}
            setFormData={setFormData}
          />
        </FormSection>
        
        <FormSection
          title="Détails de l'entreprise"
          description="Précisez votre secteur d'activité et la taille de votre entreprise"
        >
          <CompanyDetailsFields 
            formData={formData}
            setFormData={setFormData}
          />
        </FormSection>
        
        <FormSection
          title="Coordonnées"
          description="Ajoutez vos informations de contact"
        >
          <ContactFields 
            formData={formData}
            setFormData={setFormData}
          />
        </FormSection>

        <SubmitButton loading={loading} />
      </form>
    </Card>
  );
}
