
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PartnershipDialog } from "./dialogs/PartnershipDialog";
import { PricingGuideDialog } from "./dialogs/PricingGuideDialog";
import { ContactDialog } from "./dialogs/ContactDialog";
import { LegalDialog } from "./dialogs/LegalDialog";

export function AuthFooter() {
  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isCookiesOpen, setIsCookiesOpen] = useState(false);
  
  const contactInfo = {
    name: "Thomas Blanchet",
    title: "Développement / Conception",
    email: "tblanchet@hotmail.com",
    tel: "+1(819) 668-0473"
  };
  
  const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${contactInfo.name}
TITLE:${contactInfo.title}
EMAIL:${contactInfo.email}
TEL:${contactInfo.tel}
END:VCARD`;

  return (
    <footer className="mt-24 w-full max-w-xl mx-auto px-4 text-center relative" role="contentinfo">
      <div className="space-y-8 border-t border-[#F1F0FB]/20 pt-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <Button
            className="relative group bg-gradient-to-r from-[#4A90E2] to-[#64B5D9] text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => setIsPartnershipOpen(true)}
          >
            <span className="relative z-10 flex items-center gap-2">
              Partenariat
              <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:scale-150 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 rounded-full transition-transform group-hover:scale-105 duration-300" />
          </Button>

          <Button
            className="relative group bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => setIsPricingOpen(true)}
          >
            <span className="relative z-10 flex items-center gap-2">
              Guide tarifaire complet
              <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:scale-150 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 rounded-full transition-transform group-hover:scale-105 duration-300" />
          </Button>
        </div>

        <div className="flex justify-center mb-12">
          <img src="/lovable-uploads/white-signature.png" alt="Signature décorative" className="w-40 h-16 object-contain opacity-50" />
        </div>

        <nav className="flex flex-wrap justify-center gap-3 text-sm text-[#F1F0FB]/80" role="navigation">
          <Button 
            variant="link" 
            className="text-[#F1F0FB]/80 hover:text-[#F1F0FB]"
            onClick={() => setIsTermsOpen(true)}
          >
            Conditions d'utilisation
          </Button>

          <Button 
            variant="link" 
            className="text-[#F1F0FB]/80 hover:text-[#F1F0FB]"
            onClick={() => setIsPrivacyOpen(true)}
          >
            Politique de confidentialité
          </Button>

          <Button 
            variant="link" 
            className="text-[#F1F0FB]/80 hover:text-[#F1F0FB]"
            onClick={() => setIsCookiesOpen(true)}
          >
            Politique des cookies
          </Button>

          <Button 
            variant="link" 
            className="text-[#F1F0FB]/80 hover:text-[#F1F0FB]"
            onClick={() => setIsContactOpen(true)}
          >
            Nous contacter
          </Button>
        </nav>

        <div className="text-sm text-[#F1F0FB]/80 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#64B5D9]/5 to-transparent opacity-50"></div>
          <p className="relative">© 2025 Victaure Technologies inc.</p>
        </div>
      </div>

      <PartnershipDialog
        open={isPartnershipOpen}
        onOpenChange={setIsPartnershipOpen}
        contactInfo={contactInfo}
        vCardData={vCardData}
      />

      <PricingGuideDialog
        open={isPricingOpen}
        onOpenChange={setIsPricingOpen}
      />

      <LegalDialog 
        title="Conditions d'utilisation" 
        open={isTermsOpen} 
        onOpenChange={setIsTermsOpen}
      >
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
      </LegalDialog>

      <LegalDialog 
        title="Politique de confidentialité" 
        open={isPrivacyOpen} 
        onOpenChange={setIsPrivacyOpen}
      >
        <h3>1. Collecte des données</h3>
        <p>Nous collectons uniquement les données nécessaires au bon fonctionnement du service et à l'amélioration de votre expérience.</p>
        
        <h3>2. Utilisation des données</h3>
        <p>Vos données sont utilisées pour personnaliser votre expérience, améliorer nos services et vous proposer des offres pertinentes.</p>
        
        <h3>3. Protection des données</h3>
        <p>Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données personnelles.</p>
        
        <h3>4. Vos droits</h3>
        <p>Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles à tout moment.</p>
      </LegalDialog>

      <LegalDialog 
        title="Politique des cookies" 
        open={isCookiesOpen} 
        onOpenChange={setIsCookiesOpen}
      >
        <h3>1. Utilisation des cookies</h3>
        <p>Nous utilisons des cookies pour améliorer votre expérience de navigation et personnaliser nos services.</p>
        
        <h3>2. Types de cookies</h3>
        <p>Nous utilisons des cookies essentiels, analytiques et de performance pour optimiser notre plateforme.</p>
        
        <h3>3. Gestion des cookies</h3>
        <p>Vous pouvez modifier vos préférences de cookies à tout moment dans les paramètres de votre navigateur.</p>
        
        <h3>4. Conservation</h3>
        <p>Les cookies sont conservés pour une durée maximale de 13 mois conformément aux recommandations de la CNIL.</p>
      </LegalDialog>

      <ContactDialog isOpen={isContactOpen} onOpenChange={setIsContactOpen} />
    </footer>
  );
}
