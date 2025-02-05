import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PrivacyDialog() {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Politique de confidentialité</DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4 p-4 text-sm">
          <h2 className="text-lg font-semibold">1. Collecte des informations</h2>
          <p>Nous collectons les informations suivantes :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nom et prénom</li>
            <li>Adresse e-mail</li>
            <li>Numéro de téléphone</li>
            <li>Informations professionnelles</li>
          </ul>

          <h2 className="text-lg font-semibold">2. Utilisation des informations</h2>
          <p>Les informations collectées sont utilisées pour :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Personnaliser l'expérience utilisateur</li>
            <li>Améliorer notre service</li>
            <li>Communiquer avec vous concernant votre compte</li>
          </ul>

          <h2 className="text-lg font-semibold">3. Protection des informations</h2>
          <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles.</p>

          <h2 className="text-lg font-semibold">4. Cookies</h2>
          <p>Nous utilisons des cookies pour améliorer l'expérience utilisateur et analyser notre trafic.</p>
        </div>
      </ScrollArea>
    </DialogContent>
  );
}