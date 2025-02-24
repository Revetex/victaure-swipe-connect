import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function AuthFooterLinks() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });
      if (error) throw error;
      toast.success("Message envoyé avec succès!");
      setIsOpen(false);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
      console.error(error);
    }
  };

  return (
    <nav className="flex flex-wrap justify-center gap-3 text-sm text-[#F1F0FB]/80" role="navigation">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB]">
            Conditions d'utilisation
          </Button>
        </DialogTrigger>
        <DialogContent 
          className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl"
          aria-describedby="terms-description"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-2 text-[#F1F0FB]">Conditions d'utilisation</DialogTitle>
            <DialogDescription id="terms-description" className="text-[#F1F0FB]/80">
              Les conditions générales qui régissent l'utilisation de nos services
            </DialogDescription>
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

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB]">
            Politique de confidentialité
          </Button>
        </DialogTrigger>
        <DialogContent 
          className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl"
          aria-describedby="privacy-description"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-2 text-[#F1F0FB]">Politique de confidentialité</DialogTitle>
            <DialogDescription id="privacy-description" className="text-[#F1F0FB]/80">
              Comment nous protégeons et utilisons vos données personnelles
            </DialogDescription>
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

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB]">
            Politique des cookies
          </Button>
        </DialogTrigger>
        <DialogContent 
          className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl"
          aria-describedby="cookies-description"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-2 text-[#F1F0FB]">Politique des cookies</DialogTitle>
            <DialogDescription id="cookies-description" className="text-[#F1F0FB]/80">
              Comment nous utilisons les cookies pour améliorer votre expérience
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm prose-invert max-w-none">
            <h3>1. Utilisation des cookies</h3>
            <p>Nous utilisons des cookies pour améliorer votre expérience de navigation et personnaliser nos services.</p>
            
            <h3>2. Types de cookies</h3>
            <p>Nous utilisons des cookies essentiels, analytiques et de performance pour optimiser notre plateforme.</p>
            
            <h3>3. Gestion des cookies</h3>
            <p>Vous pouvez modifier vos préférences de cookies à tout moment dans les paramètres de votre navigateur.</p>
            
            <h3>4. Conservation</h3>
            <p>Les cookies sont conservés pour une durée maximale de 13 mois conformément aux recommandations de la CNIL.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB]">
            Nous contacter
          </Button>
        </DialogTrigger>
        <DialogContent 
          className="sm:max-w-[425px] bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl"
          aria-describedby="contact-description"
        >
          <DialogHeader>
            <DialogTitle className="text-[#F1F0FB] mb-2">Contactez-nous</DialogTitle>
            <DialogDescription id="contact-description" className="text-[#F1F0FB]/80">
              Envoyez-nous un message et nous vous répondrons dans les plus brefs délais
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Input
                id="name"
                placeholder="Votre nom"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/10 border-[#F1F0FB]/20 text-[#F1F0FB]"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white/10 border-[#F1F0FB]/20 text-[#F1F0FB]"
                required
              />
            </div>
            <div className="space-y-2">
              <Textarea
                id="message"
                placeholder="Votre message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="min-h-[100px] bg-white/10 border-[#F1F0FB]/20 text-[#F1F0FB]"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#64B5D9] hover:bg-[#4A90E2] text-white transition-colors"
            >
              Envoyer
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
