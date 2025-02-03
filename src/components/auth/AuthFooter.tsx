import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export const AuthFooter = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="text-center text-sm pb-8 space-y-4"
    >
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Politique de confidentialité
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Politique de confidentialité</DialogTitle>
            </DialogHeader>
            <div className="prose prose-sm mt-4 text-muted-foreground">
              <h2 className="text-foreground">1. Collecte des informations</h2>
              <p>Nous collectons les informations suivantes :</p>
              <ul className="text-muted-foreground">
                <li>Nom et prénom</li>
                <li>Adresse e-mail</li>
                <li>Numéro de téléphone</li>
                <li>Informations professionnelles</li>
              </ul>

              <h2 className="text-foreground">2. Utilisation des informations</h2>
              <p>Les informations collectées sont utilisées pour :</p>
              <ul className="text-muted-foreground">
                <li>Personnaliser l'expérience utilisateur</li>
                <li>Améliorer notre service</li>
                <li>Communiquer avec vous concernant votre compte</li>
              </ul>

              <h2 className="text-foreground">3. Protection des informations</h2>
              <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles.</p>

              <h2 className="text-foreground">4. Cookies</h2>
              <p>Nous utilisons des cookies pour améliorer l'expérience utilisateur et analyser notre trafic.</p>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Conditions d'utilisation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Conditions d'utilisation</DialogTitle>
            </DialogHeader>
            <div className="prose prose-sm mt-4 text-muted-foreground">
              <h2 className="text-foreground">1. Acceptation des conditions</h2>
              <p>En accédant à ce site, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.</p>

              <h2 className="text-foreground">2. Licence d'utilisation</h2>
              <p>Une licence limitée, non exclusive et non transférable vous est accordée pour accéder et utiliser le site.</p>

              <h2 className="text-foreground">3. Compte utilisateur</h2>
              <p>Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe.</p>

              <h2 className="text-foreground">4. Limitations de responsabilité</h2>
              <p>Nous ne serons pas tenus responsables des dommages directs, indirects, accessoires ou consécutifs.</p>

              <h2 className="text-foreground">5. Modifications du service</h2>
              <p>Nous nous réservons le droit de modifier ou d'interrompre le service sans préavis.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="text-muted-foreground">
        © {new Date().getFullYear()} Victaure. Tous droits réservés.
      </div>
    </motion.div>
  );
};