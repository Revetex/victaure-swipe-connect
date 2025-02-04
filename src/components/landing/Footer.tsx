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
              <DialogTrigger className="text-primary hover:underline text-sm">
                Lire notre politique de confidentialité
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
                    </ul>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">2. Utilisation des informations</h3>
                    <p>Les informations collectées sont utilisées pour :</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Personnaliser l'expérience utilisateur</li>
                      <li>Améliorer notre service</li>
                      <li>Communiquer avec vous concernant votre compte</li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">3. Protection des informations</h3>
                    <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles.</p>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">4. Cookies</h3>
                    <p>Nous utilisons des cookies pour améliorer l'expérience utilisateur et analyser notre trafic.</p>
                  </section>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Conditions d'Utilisation</h3>
            <Dialog>
              <DialogTrigger className="text-primary hover:underline text-sm">
                Voir les conditions d'utilisation
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Conditions d'Utilisation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <section>
                    <h3 className="font-semibold text-foreground">1. Acceptation des conditions</h3>
                    <p>En accédant à ce site, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.</p>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">2. Licence d'utilisation</h3>
                    <p>Une licence limitée, non exclusive et non transférable vous est accordée pour accéder et utiliser le site.</p>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">3. Compte utilisateur</h3>
                    <p>Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe.</p>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">4. Limitations de responsabilité</h3>
                    <p>Nous ne serons pas tenus responsables des dommages directs, indirects, accessoires ou consécutifs.</p>
                  </section>
                  <section>
                    <h3 className="font-semibold text-foreground">5. Modifications du service</h3>
                    <p>Nous nous réservons le droit de modifier ou d'interrompre le service sans préavis.</p>
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