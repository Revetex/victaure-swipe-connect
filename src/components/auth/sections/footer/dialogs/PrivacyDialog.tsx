
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield } from "lucide-react";

export function PrivacyDialog() {
  return (
    <DialogContent className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB] flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#64B5D9]" />
          Politique de confidentialité
        </DialogTitle>
      </DialogHeader>
      <div className="prose prose-sm prose-invert max-w-none space-y-6">
        <section>
          <h3 className="text-lg font-medium text-[#F1F0FB]">1. Collecte des données</h3>
          <p className="text-[#F1F0FB]/80">
            Nous collectons uniquement les données nécessaires au bon fonctionnement du service et à l'amélioration de votre expérience.
          </p>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-[#F1F0FB]">2. Utilisation des données</h3>
          <p className="text-[#F1F0FB]/80">Vos données sont utilisées pour personnaliser votre expérience et améliorer nos services.</p>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-[#F1F0FB]">3. Protection des données</h3>
          <p className="text-[#F1F0FB]/80">
            Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données personnelles.
          </p>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-[#F1F0FB]">4. Vos droits</h3>
          <p className="text-[#F1F0FB]/80">
            Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles à tout moment.
          </p>
        </section>
      </div>
    </DialogContent>
  );
}
