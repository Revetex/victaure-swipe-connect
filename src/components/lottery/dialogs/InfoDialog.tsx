
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, Diamond, Trophy, Star } from "lucide-react";

export function InfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 text-sm">
          <HelpCircle className="h-4 w-4" />
          Infos
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl sm:w-full">
        <DialogHeader>
          <DialogTitle>Informations sur nos Jeux</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>Nos jeux sont conçus pour offrir une expérience divertissante et équitable à tous les utilisateurs.</p>
          <div className="grid gap-4">
            <div className="flex items-start gap-2">
              <Diamond className="h-4 w-4 text-blue-400 mt-1" />
              <div>
                <h4 className="font-medium text-foreground">Échecs vs IA</h4>
                <p>Affrontez notre IA avec différents niveaux de difficulté.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Trophy className="h-4 w-4 text-yellow-400 mt-1" />
              <div>
                <h4 className="font-medium text-foreground">Pyramid Rush</h4>
                <p>Testez votre chance dans ce jeu de probabilités captivant.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-purple-400 mt-1" />
              <div>
                <h4 className="font-medium text-foreground">Zodiac Fortune</h4>
                <p>Découvrez votre chance à travers les signes du zodiaque.</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
