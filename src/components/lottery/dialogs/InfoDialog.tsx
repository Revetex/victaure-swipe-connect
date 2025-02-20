
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export function InfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-sm">
          <Info className="h-4 w-4" />
          Règles du jeu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Règles de LotoSphere & Programme VIP</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <section>
            <h3 className="font-semibold mb-2">Comment jouer</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Sélectionnez 5 numéros entre 1 et 50</li>
              <li>Choisissez une couleur bonus</li>
              <li>Un ticket coûte 5 CAD</li>
              <li>Tirage tous les soirs à 21h00</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Gains</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>5 numéros + couleur : 2 000 000 CAD</li>
              <li>5 numéros : 100 000 CAD</li>
              <li>4 numéros : 1 000 CAD</li>
              <li>3 numéros : 50 CAD</li>
              <li>2 numéros : 5 CAD</li>
              <li>Couleur seule : 2 CAD</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Programme VIP</h3>
            <div className="grid gap-2">
              <div className="border p-2 rounded-lg">
                <h4 className="font-medium">Bronze - 50 CAD/mois</h4>
                <p>1 ticket gratuit tous les 5 tickets achetés</p>
              </div>
              <div className="border p-2 rounded-lg">
                <h4 className="font-medium">Argent - 100 CAD/mois</h4>
                <p>+5% sur tous les gains + avantages Bronze</p>
              </div>
              <div className="border p-2 rounded-lg">
                <h4 className="font-medium">Or - 200 CAD/mois</h4>
                <p>+10% sur tous les gains + avantages Argent</p>
              </div>
              <div className="border p-2 rounded-lg">
                <h4 className="font-medium">Platine - 500 CAD/mois</h4>
                <p>1 ticket gratuit par jour + avantages Or</p>
              </div>
              <div className="border p-2 rounded-lg">
                <h4 className="font-medium">Diamant - 1000 CAD/mois</h4>
                <p>2 tickets gratuits par jour + avantages Platine</p>
              </div>
            </div>
          </section>

          <section className="text-muted-foreground text-xs">
            <p>* Les avantages se cumulent avec les niveaux supérieurs</p>
            <p>* Les tickets gratuits ont la même valeur qu'un ticket standard</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
