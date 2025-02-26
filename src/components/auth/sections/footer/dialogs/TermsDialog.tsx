
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText } from "lucide-react";

export function TermsDialog() {
  return (
    <DialogContent className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB] flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#64B5D9]" />
          Conditions d'utilisation
        </DialogTitle>
      </DialogHeader>
      <div className="prose prose-sm prose-invert max-w-none">
        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-[#F1F0FB]">1. Acceptation des conditions</h3>
            <p className="text-[#F1F0FB]/80">En accédant à Victaure, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-[#F1F0FB]">2. Utilisation du service</h3>
            <p className="text-[#F1F0FB]/80">Vous vous engagez à utiliser le service de manière éthique et légale. Toute utilisation frauduleuse ou abusive est strictement interdite.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-[#F1F0FB]">3. Responsabilité</h3>
            <p className="text-[#F1F0FB]/80">Victaure ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de la plateforme.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-[#F1F0FB]">4. Protection des données</h3>
            <p className="text-[#F1F0FB]/80">Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité.</p>
          </div>
        </section>
      </div>
    </DialogContent>
  );
}
