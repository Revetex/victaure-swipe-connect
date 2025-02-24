
import React, { useState } from 'react';
import { BusinessFormHeader } from './BusinessFormHeader';
import { CompanyInfoFields } from './CompanyInfoFields';
import { CompanyDetailsFields } from './CompanyDetailsFields';
import { ContactFields } from './ContactFields';
import { SubmitButton } from './SubmitButton';
import { useBusinessSignup } from './useBusinessSignup';
import { BusinessSignupFormProps } from './types';
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

export function BusinessSignupForm({ redirectTo }: BusinessSignupFormProps) {
  const { formData, setFormData, loading, handleSubmit } = useBusinessSignup(redirectTo);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error("Veuillez accepter les conditions d'utilisation");
      return;
    }
    handleSubmit(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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

        <div className="flex items-center space-x-2 mt-6">
          <Checkbox 
            id="terms" 
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            className="bg-[#1B2A4A]/40 border-[#64B5D9]/20 data-[state=checked]:bg-[#64B5D9]"
          />
          <Label
            htmlFor="terms"
            className="text-sm font-medium text-[#F1F0FB]/80"
          >
            J'accepte la{" "}
            <Dialog>
              <DialogTrigger className="text-[#64B5D9] hover:underline">
                politique de confidentialité
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-[#1B2A4A]/95 border-[#64B5D9]/20">
                <DialogHeader>
                  <DialogTitle className="text-[#F1F0FB]">Politique de confidentialité</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4 p-4 text-sm text-[#F1F0FB]/80">
                    {/* ... Contenu de la politique de confidentialité */}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            {" "}et les{" "}
            <Dialog>
              <DialogTrigger className="text-[#64B5D9] hover:underline">
                conditions d'utilisation
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-[#1B2A4A]/95 border-[#64B5D9]/20">
                <DialogHeader>
                  <DialogTitle className="text-[#F1F0FB]">Conditions d'utilisation</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4 p-4 text-sm text-[#F1F0FB]/80">
                    {/* ... Contenu des conditions d'utilisation */}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </Label>
        </div>
      </div>

      <SubmitButton loading={loading} disabled={!acceptedTerms} />
    </form>
  );
}
