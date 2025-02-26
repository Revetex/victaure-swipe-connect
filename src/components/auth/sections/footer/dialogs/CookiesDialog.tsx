
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield } from "lucide-react";

export function CookiesDialog() {
  return (
    <DialogContent className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB] flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#64B5D9]" />
          Politique des Cookies
        </DialogTitle>
      </DialogHeader>
      <div className="prose prose-sm prose-invert max-w-none space-y-6">
        <section>
          <h3 className="text-lg font-medium text-[#F1F0FB]">1. Qu'est-ce qu'un cookie ?</h3>
          <p className="text-[#F1F0FB]/80">
            Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile lors de la visite d'un site web.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-medium text-[#F1F0FB]">2. Comment utilisons-nous les cookies ?</h3>
          <p className="text-[#F1F0FB]/80">Nous utilisons les cookies pour :</p>
          <ul className="list-disc pl-6 text-[#F1F0FB]/80">
            <li>Assurer le bon fonctionnement du site</li>
            <li>Mémoriser vos préférences</li>
            <li>Améliorer la performance du site</li>
            <li>Analyser l'utilisation du site</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-medium text-[#F1F0FB]">3. Types de cookies utilisés</h3>
          <div className="space-y-4 text-[#F1F0FB]/80">
            <div>
              <h4 className="font-medium text-[#64B5D9]">Cookies essentiels</h4>
              <p>Nécessaires au fonctionnement du site.</p>
            </div>
            <div>
              <h4 className="font-medium text-[#64B5D9]">Cookies de performance</h4>
              <p>Pour améliorer les performances du site.</p>
            </div>
            <div>
              <h4 className="font-medium text-[#64B5D9]">Cookies de fonctionnalité</h4>
              <p>Pour mémoriser vos préférences.</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-[#F1F0FB]">4. Contrôle des cookies</h3>
          <p className="text-[#F1F0FB]/80">
            Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. Vous pouvez supprimer tous les cookies déjà présents sur votre ordinateur et paramétrer la plupart des navigateurs pour qu'ils les bloquent.
          </p>
        </section>
      </div>
    </DialogContent>
  );
}
