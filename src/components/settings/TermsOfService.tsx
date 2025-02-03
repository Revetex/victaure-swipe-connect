import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TermsOfService() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Conditions d'utilisation</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <section>
              <h3 className="font-medium text-foreground">Utilisation du service</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>Création de compte véridique</li>
                <li>Respect des autres utilisateurs</li>
                <li>Utilisation professionnelle uniquement</li>
                <li>Protection des données personnelles</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium text-foreground">Responsabilités</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>Exactitude des informations fournies</li>
                <li>Confidentialité des identifiants</li>
                <li>Respect de la propriété intellectuelle</li>
                <li>Usage conforme à la loi</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium text-foreground">Limitations</h3>
              <p>Il est interdit de :</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Créer de faux profils</li>
                <li>Harceler d'autres utilisateurs</li>
                <li>Diffuser du contenu inapproprié</li>
                <li>Utiliser des bots ou scripts automatisés</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium text-foreground">Modifications</h3>
              <p>Nous nous réservons le droit de :</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Modifier les conditions d'utilisation</li>
                <li>Suspendre des comptes suspects</li>
                <li>Mettre à jour nos services</li>
                <li>Informer des changements importants</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}