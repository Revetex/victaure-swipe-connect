
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollText } from "lucide-react";

export function RulesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 text-sm">
          <ScrollText className="h-4 w-4" />
          Règlement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Règlement et Conditions d'Utilisation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <section>
            <h3 className="font-semibold text-foreground mb-2">1. Conditions Générales</h3>
            <p>En accédant à nos jeux, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.</p>
          </section>
          
          <section>
            <h3 className="font-semibold text-foreground mb-2">2. Responsabilité</h3>
            <p>Les jeux sont fournis "tels quels". Nous ne pouvons garantir qu'ils seront sans interruption, sécurisés ou sans erreurs.</p>
          </section>
          
          <section>
            <h3 className="font-semibold text-foreground mb-2">3. Fair-Play</h3>
            <p>Toute tentative de triche ou d'exploitation de bugs entraînera une suspension immédiate du compte.</p>
          </section>
          
          <section>
            <h3 className="font-semibold text-foreground mb-2">4. Protection des Données</h3>
            <p>Vos données de jeu sont protégées conformément à notre politique de confidentialité.</p>
          </section>
          
          <section>
            <h3 className="font-semibold text-foreground mb-2">5. Propriété Intellectuelle</h3>
            <p>Tout le contenu des jeux est protégé par les lois sur la propriété intellectuelle.</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
