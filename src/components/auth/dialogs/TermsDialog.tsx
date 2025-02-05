import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsDialog({ open, onOpenChange }: TermsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Conditions générales d'utilisation</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4 p-4 text-sm">
            <h2 className="text-lg font-semibold">1. Acceptation des conditions</h2>
            <p>En accédant à ce site, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.</p>

            <h2 className="text-lg font-semibold">2. Licence d'utilisation</h2>
            <p>Une licence limitée, non exclusive et non transférable vous est accordée pour accéder et utiliser le site.</p>

            <h2 className="text-lg font-semibold">3. Compte utilisateur</h2>
            <p>Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe.</p>

            <h2 className="text-lg font-semibold">4. Limitations de responsabilité</h2>
            <p>Nous ne serons pas tenus responsables des dommages directs, indirects, accessoires ou consécutifs.</p>

            <h2 className="text-lg font-semibold">5. Modifications du service</h2>
            <p>Nous nous réservons le droit de modifier ou d'interrompre le service sans préavis.</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}