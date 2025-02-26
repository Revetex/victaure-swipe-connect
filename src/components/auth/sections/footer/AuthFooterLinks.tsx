
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function AuthFooterLinks() {
  return (
    <nav className="flex flex-wrap justify-center gap-3 text-sm text-[#F1F0FB]/80" role="navigation">
      {/* Terms Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB] font-thin">
            Conditions d'utilisation
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB]">Conditions d'utilisation</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm prose-invert max-w-none">
            <h3>1. Acceptation des conditions</h3>
            <p>En accédant à Victaure, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.</p>
            
            <h3>2. Utilisation du service</h3>
            <p>Vous vous engagez à utiliser le service de manière éthique et légale. Toute utilisation frauduleuse ou abusive est strictement interdite.</p>
            
            <h3>3. Responsabilité</h3>
            <p>Victaure ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de la plateforme.</p>
            
            <h3>4. Protection des données</h3>
            <p>Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité.</p>
            
            <h3>5. Propriété intellectuelle</h3>
            <p>Tout le contenu sur Victaure est protégé par les droits d'auteur et autres lois sur la propriété intellectuelle.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB] font-thin">
            Politique de confidentialité
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB]">Politique de confidentialité</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm prose-invert max-w-none">
            <h3>1. Collecte des données</h3>
            <p>Nous collectons uniquement les données nécessaires au bon fonctionnement du service et à l'amélioration de votre expérience.</p>
            
            <h3>2. Utilisation des données</h3>
            <p>Vos données sont utilisées pour personnaliser votre expérience, améliorer nos services et vous proposer des offres pertinentes.</p>
            
            <h3>3. Protection des données</h3>
            <p>Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données personnelles.</p>
            
            <h3>4. Vos droits</h3>
            <p>Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles à tout moment.</p>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
