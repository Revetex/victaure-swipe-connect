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

export function BusinessSignupForm({ redirectTo }: BusinessSignupFormProps) {
  const { formData, setFormData, loading, handleSubmit } = useBusinessSignup(redirectTo);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const onSubmitWithValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      return;
    }
    handleSubmit(e);
  };

  return (
    <form onSubmit={onSubmitWithValidation} className="space-y-6">
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

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              required
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none text-[#F1F0FB]/80"
            >
              J'accepte la{" "}
              <Dialog>
                <DialogTrigger className="text-[#64B5D9] hover:underline">
                  politique de confidentialité
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Politique de confidentialité</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4 p-4 text-sm">
                      <h3>1. Collecte des données</h3>
                      <p>Nous collectons uniquement les données nécessaires au bon fonctionnement du service et à l'amélioration de votre expérience.</p>
                      
                      <h3>2. Utilisation des données</h3>
                      <p>Vos données sont utilisées pour personnaliser votre expérience, améliorer nos services et vous proposer des offres pertinentes.</p>
                      
                      <h3>3. Protection des données</h3>
                      <p>Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données personnelles.</p>
                      
                      <h3>4. Vos droits</h3>
                      <p>Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles à tout moment.</p>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              {" "}et les{" "}
              <Dialog>
                <DialogTrigger className="text-[#64B5D9] hover:underline">
                  conditions d'utilisation
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Conditions d'utilisation</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4 p-4 text-sm">
                      <h3>1. Acceptation des conditions</h3>
                      <p>En accédant à Victaure, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.</p>
                      
                      <h3>2. Utilisation du service</h3>
                      <p>Vous vous engagez à utiliser le service de manière éthique et légale. Toute utilisation frauduleuse ou abusive est strictement interdite.</p>
                      
                      <h3>3. Responsabilité</h3>
                      <p>Victaure ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de la plateforme.</p>
                      
                      <h3>4. Protection des données</h3>
                      <p>Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité.</p>
                      
                      <h3>5. Propriété intellectuelle</h3>
                      <p>Tout le contenu sur Victaure est protégé par les droits d'auteur et autres lois sur la propriété intellectuelle.</p>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </label>
          </div>
        </div>
      </div>

      <SubmitButton loading={loading} disabled={!acceptedTerms} />
    </form>
  );
}
