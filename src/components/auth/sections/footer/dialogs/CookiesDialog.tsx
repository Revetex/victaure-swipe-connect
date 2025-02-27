
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield } from "lucide-react";

export function CookiesDialog() {
  return (
    <DialogContent className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB] flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#64B5D9]" />
          Politique des Cookies
        </DialogTitle>
      </DialogHeader>
      <div className="prose prose-sm prose-invert max-w-none space-y-6">
        <section>
          <div className="space-y-4">
            <div className="bg-[#1A1F2C]/40 rounded-lg p-4">
              <h3 className="text-lg font-medium text-[#F1F0FB]">Qu'est-ce qu'un cookie ?</h3>
              <p className="text-[#F1F0FB]/80 text-sm mt-2">
                Un cookie est un petit fichier texte stocké sur votre appareil lors de la visite d'un site web. Il nous permet d'améliorer votre expérience utilisateur.
              </p>
            </div>

            <div className="bg-[#1A1F2C]/40 rounded-lg p-4">
              <h3 className="text-lg font-medium text-[#F1F0FB]">Types de cookies utilisés</h3>
              <div className="space-y-3 mt-2">
                <div>
                  <h4 className="font-medium text-[#64B5D9] text-sm">Cookies essentiels</h4>
                  <p className="text-[#F1F0FB]/80 text-sm">Nécessaires au fonctionnement du site.</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#64B5D9] text-sm">Cookies de performance</h4>
                  <p className="text-[#F1F0FB]/80 text-sm">Pour améliorer les performances du site.</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#64B5D9] text-sm">Cookies de fonctionnalité</h4>
                  <p className="text-[#F1F0FB]/80 text-sm">Pour mémoriser vos préférences.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1F2C]/40 rounded-lg p-4">
              <h3 className="text-lg font-medium text-[#F1F0FB]">Contrôle des cookies</h3>
              <p className="text-[#F1F0FB]/80 text-sm mt-2">
                Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. Vous pouvez supprimer tous les cookies déjà présents sur votre appareil et paramétrer la plupart des navigateurs pour qu'ils les bloquent.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DialogContent>
  );
}
