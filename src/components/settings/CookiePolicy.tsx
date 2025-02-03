import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CookiePolicy() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Politique des cookies</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <section>
              <h3 className="font-medium text-foreground">Types de cookies utilisés</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>Cookies essentiels (authentification, sécurité)</li>
                <li>Cookies de préférences (thème, langue)</li>
                <li>Cookies analytiques (amélioration du service)</li>
                <li>Cookies de session (navigation)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium text-foreground">Durée de conservation</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>Cookies de session : supprimés à la fermeture du navigateur</li>
                <li>Cookies persistants : maximum 13 mois</li>
                <li>Cookies d'authentification : 30 jours maximum</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium text-foreground">Gestion des cookies</h3>
              <p>Vous pouvez à tout moment :</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Accepter ou refuser les cookies non essentiels</li>
                <li>Supprimer les cookies existants</li>
                <li>Configurer votre navigateur</li>
                <li>Retirer votre consentement</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}