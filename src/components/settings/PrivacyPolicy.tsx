import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PrivacyPolicy() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Politique de confidentialité</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <section>
              <h3 className="font-medium text-foreground">Collecte des données</h3>
              <p>Nous collectons uniquement les données nécessaires au bon fonctionnement de nos services :</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Informations de profil (nom, email, photo)</li>
                <li>Données professionnelles (CV, compétences)</li>
                <li>Préférences de recherche d'emploi</li>
                <li>Historique des interactions</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium text-foreground">Utilisation des données</h3>
              <p>Vos données sont utilisées pour :</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Personnaliser votre expérience</li>
                <li>Améliorer nos services de matching</li>
                <li>Communiquer avec vous</li>
                <li>Assurer la sécurité de votre compte</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium text-foreground">Protection des données</h3>
              <p>Nous mettons en œuvre des mesures de sécurité robustes :</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Chiffrement des données sensibles</li>
                <li>Authentification sécurisée</li>
                <li>Surveillance continue des accès</li>
                <li>Mises à jour régulières de sécurité</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium text-foreground">Vos droits</h3>
              <p>Vous disposez des droits suivants :</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Accès à vos données personnelles</li>
                <li>Rectification de vos informations</li>
                <li>Suppression de votre compte</li>
                <li>Opposition au traitement</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}