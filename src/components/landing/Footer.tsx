import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function Footer() {
  return (
    <footer className="bg-background/80 dark:bg-background/80 py-8 px-4 mt-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <p className="text-muted-foreground">
              Email: <br />
              <a href="mailto:admin@victaure.com" className="text-primary hover:underline">admin@victaure.com</a>
              <br />
              <a href="mailto:tblanchet3909@hotmail.com" className="text-primary hover:underline">tblanchet3909@hotmail.com</a>
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Mentions Légales</h3>
            <p className="text-muted-foreground text-sm">
              © 2024 Victaure. Tous droits réservés.<br />
              Toute reproduction interdite sans autorisation.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Politique de Confidentialité</h3>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-primary hover:underline text-sm">
                  Lire notre politique de confidentialité
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Politique de Confidentialité</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <section>
                    <h3 className="font-semibold text-foreground">1. Collecte des informations</h3>
                    <p>Nous collectons les informations suivantes :</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Nom et prénom</li>
                      <li>Adresse e-mail</li>
                      <li>Numéro de téléphone</li>
                      <li>Informations professionnelles</li>
                      <li>Données de localisation (si activées)</li>
                      <li>Préférences de communication</li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">2. Utilisation des informations</h3>
                    <p>Les informations collectées sont utilisées pour :</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Personnaliser votre expérience utilisateur</li>
                      <li>Améliorer notre service</li>
                      <li>Communiquer avec vous concernant votre compte</li>
                      <li>Vous proposer des offres d'emploi pertinentes</li>
                      <li>Analyser et améliorer nos services</li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">3. Protection des informations</h3>
                    <p>Nous mettons en œuvre des mesures de sécurité robustes pour protéger vos données :</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Chiffrement SSL/TLS</li>
                      <li>Authentification à deux facteurs (2FA)</li>
                      <li>Stockage sécurisé des données</li>
                      <li>Accès restreint aux données personnelles</li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">4. Vos droits</h3>
                    <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Droit d'accès à vos données</li>
                      <li>Droit de rectification</li>
                      <li>Droit à l'effacement</li>
                      <li>Droit à la portabilité</li>
                      <li>Droit d'opposition</li>
                    </ul>
                  </section>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Conditions d'Utilisation</h3>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-primary hover:underline text-sm">
                  Voir les conditions d'utilisation
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Conditions d'Utilisation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <section>
                    <h3 className="font-semibold text-foreground">1. Acceptation des conditions</h3>
                    <p>En utilisant Victaure, vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.</p>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">2. Utilisation du service</h3>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Vous devez avoir au moins 18 ans pour utiliser nos services</li>
                      <li>Vous êtes responsable de maintenir la confidentialité de votre compte</li>
                      <li>Vous acceptez de ne pas utiliser le service à des fins illégales</li>
                      <li>Vous acceptez de ne pas créer de faux profils ou de fausses informations</li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">3. Propriété intellectuelle</h3>
                    <p>Tous les contenus présents sur Victaure (logos, textes, fonctionnalités) sont la propriété exclusive de Victaure ou de ses partenaires.</p>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">4. Protection des données</h3>
                    <p>Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité et au RGPD.</p>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">5. Résiliation</h3>
                    <p>Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de violation de ces conditions.</p>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">6. Modifications</h3>
                    <p>Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront effectives dès leur publication.</p>
                  </section>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </footer>
  );
}