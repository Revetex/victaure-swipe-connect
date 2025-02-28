
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield } from "lucide-react";

export function PrivacyDialog() {
  return (
    <DialogContent className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB] flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#64B5D9]" />
          Politique de confidentialité
        </DialogTitle>
      </DialogHeader>
      <div className="prose prose-sm prose-invert max-w-none space-y-6">
        <section className="space-y-4">
          <div className="bg-[#1A1F2C]/40 rounded-lg p-4">
            <h3 className="text-lg font-medium text-[#F1F0FB]">1. Collecte des données</h3>
            <p className="text-[#F1F0FB]/80 text-sm mt-2">
              Nous collectons uniquement les données nécessaires au bon fonctionnement du service et à l'amélioration de votre expérience.
            </p>
            <ul className="list-disc pl-4 mt-2 text-sm text-[#F1F0FB]/70">
              <li>Informations de profil</li>
              <li>Données de connexion</li>
              <li>Préférences utilisateur</li>
            </ul>
          </div>

          <div className="bg-[#1A1F2C]/40 rounded-lg p-4">
            <h3 className="text-lg font-medium text-[#F1F0FB]">2. Utilisation des données</h3>
            <p className="text-[#F1F0FB]/80 text-sm mt-2">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-4 mt-2 text-sm text-[#F1F0FB]/70">
              <li>Personnaliser votre expérience</li>
              <li>Améliorer nos services</li>
              <li>Assurer la sécurité de votre compte</li>
            </ul>
          </div>

          <div className="bg-[#1A1F2C]/40 rounded-lg p-4">
            <h3 className="text-lg font-medium text-[#F1F0FB]">3. Protection des données</h3>
            <p className="text-[#F1F0FB]/80 text-sm mt-2">
              Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données personnelles :
            </p>
            <ul className="list-disc pl-4 mt-2 text-sm text-[#F1F0FB]/70">
              <li>Chiffrement des données</li>
              <li>Accès sécurisé</li>
              <li>Surveillance continue</li>
            </ul>
          </div>

          <div className="bg-[#1A1F2C]/40 rounded-lg p-4">
            <h3 className="text-lg font-medium text-[#F1F0FB]">4. Vos droits</h3>
            <p className="text-[#F1F0FB]/80 text-sm mt-2">
              Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles à tout moment.
            </p>
            <div className="mt-2 text-sm text-[#F1F0FB]/70">
              <p>Pour exercer ces droits, contactez-nous via :</p>
              <ul className="list-disc pl-4 mt-1">
                <li>Notre formulaire de contact</li>
                <li>Notre support client</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DialogContent>
  );
}
