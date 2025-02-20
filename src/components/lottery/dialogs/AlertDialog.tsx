
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function AlertDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 text-sm">
          <AlertTriangle className="h-4 w-4" />
          Alerte
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl sm:w-full">
        <DialogHeader>
          <DialogTitle>Jeu Responsable</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Jouez de manière responsable :</p>
          <ul className="list-disc pl-4 space-y-2">
            <li>Fixez-vous des limites de temps et respectez-les</li>
            <li>Ne jouez que pour le divertissement</li>
            <li>Prenez des pauses régulières</li>
            <li>N'essayez pas de récupérer vos pertes</li>
          </ul>
          <p className="text-yellow-500">Si vous avez besoin d'aide, n'hésitez pas à contacter notre support.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
