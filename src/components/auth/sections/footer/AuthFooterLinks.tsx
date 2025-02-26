
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CookiesDialog } from "./dialogs/CookiesDialog";
import { FileText, Shield, Mail } from "lucide-react";

export function AuthFooterLinks() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isCookiesOpen, setIsCookiesOpen] = useState(false);
  
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
      setIsContactOpen(false);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
      console.error(error);
    }
  };

  return (
    <nav className="flex flex-wrap justify-center gap-3 text-sm text-[#F1F0FB]/80" role="navigation">
      {/* Terms Dialog */}
      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB] font-thin">
            Conditions d'utilisation
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB] flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#64B5D9]" />
              Conditions d'utilisation
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm prose-invert max-w-none">
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-[#F1F0FB]">1. Acceptation des conditions</h3>
                <p className="text-[#F1F0FB]/80">En accédant à Victaure, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-[#F1F0FB]">2. Utilisation du service</h3>
                <p className="text-[#F1F0FB]/80">Vous vous engagez à utiliser le service de manière éthique et légale. Toute utilisation frauduleuse ou abusive est strictement interdite.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-[#F1F0FB]">3. Responsabilité</h3>
                <p className="text-[#F1F0FB]/80">Victaure ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de la plateforme.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-[#F1F0FB]">4. Protection des données</h3>
                <p className="text-[#F1F0FB]/80">Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité.</p>
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB] font-thin">
            Politique de confidentialité
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB] flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#64B5D9]" />
              Politique de confidentialité
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm prose-invert max-w-none space-y-6">
            <section>
              <h3 className="text-lg font-medium text-[#F1F0FB]">1. Collecte des données</h3>
              <p className="text-[#F1F0FB]/80">
                Nous collectons uniquement les données nécessaires au bon fonctionnement du service et à l'amélioration de votre expérience.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-medium text-[#F1F0FB]">2. Utilisation des données</h3>
              <p className="text-[#F1F0FB]/80">Vos données sont utilisées pour personnaliser votre expérience et améliorer nos services.</p>
            </section>
            
            <section>
              <h3 className="text-lg font-medium text-[#F1F0FB]">3. Protection des données</h3>
              <p className="text-[#F1F0FB]/80">
                Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données personnelles.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-medium text-[#F1F0FB]">4. Vos droits</h3>
              <p className="text-[#F1F0FB]/80">
                Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles à tout moment.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cookies Dialog */}
      <Dialog open={isCookiesOpen} onOpenChange={setIsCookiesOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB] font-thin">
            Cookies
          </Button>
        </DialogTrigger>
        <CookiesDialog />
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB] text-sm font-thin">
            Contact
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB] flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#64B5D9]" />
              Contactez-nous
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="contact-name" className="text-sm font-medium text-[#F1F0FB]">
                Nom
              </label>
              <Input
                id="contact-name"
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                className="bg-[#1B2A4A]/50 border-[#64B5D9]/20 text-[#F1F0FB] placeholder:text-[#F1F0FB]/30"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-email" className="text-sm font-medium text-[#F1F0FB]">
                Email
              </label>
              <Input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                className="bg-[#1B2A4A]/50 border-[#64B5D9]/20 text-[#F1F0FB] placeholder:text-[#F1F0FB]/30"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-message" className="text-sm font-medium text-[#F1F0FB]">
                Message
              </label>
              <Textarea
                id="contact-message"
                required
                value={formData.message}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  message: e.target.value
                }))}
                className="bg-[#1B2A4A]/50 border-[#64B5D9]/20 text-[#F1F0FB] placeholder:text-[#F1F0FB]/30 min-h-[100px]"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] hover:opacity-90 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Envoyer
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
