
import React from 'react';
import { BusinessFormHeader } from './business/BusinessFormHeader';
import { CompanyInfoFields } from './business/CompanyInfoFields';
import { CompanyDetailsFields } from './business/CompanyDetailsFields';
import { ContactFields } from './business/ContactFields';
import { SubmitButton } from './business/SubmitButton';
import { useBusinessSignup } from './business/useBusinessSignup';
import { BusinessSignupFormProps } from './business/types';

export function BusinessSignupForm({ redirectTo }: BusinessSignupFormProps) {
  const { formData, setFormData, loading, handleSubmit } = useBusinessSignup(redirectTo);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BusinessFormHeader />
      
      <div className="space-y-4">
        <CompanyInfoFields 
          formData={formData}
          setFormData={setFormData}
        />
        
        <CompanyDetailsFields 
          formData={formData}
          setFormData={setFormData}
        />
        
        <ContactFields 
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      <SubmitButton loading={loading} />
    </form>
  );
}
