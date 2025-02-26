
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
      <Dialog>
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
              
              <div>
                <h3 className="text-lg font-medium text-[#F1F0FB]">5. Propriété intellectuelle</h3>
                <p className="text-[#F1F0FB]/80">Tout le contenu sur Victaure est protégé par les droits d'auteur et autres lois sur la propriété intellectuelle.</p>
              </div>
            </section>
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
            <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB] flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#64B5D9]" />
              Politique de confidentialité
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm prose-invert max-w-none space-y-6">
            <section>
              <h3 className="text-lg font-medium text-[#F1F0FB]">1. Collecte des données</h3>
              <p className="text-[#F1F0FB]/80">
                Nous collectons uniquement les données nécessaires au bon fonctionnement du service et à l'amélioration de votre expérience :
              </p>
              <ul className="list-disc pl-6 text-[#F1F0FB]/80">
                <li>Informations de profil</li>
                <li>Données de connexion</li>
                <li>Préférences utilisateur</li>
                <li>Interactions avec le service</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-medium text-[#F1F0FB]">2. Utilisation des données</h3>
              <p className="text-[#F1F0FB]/80">Vos données sont utilisées pour :</p>
              <ul className="list-disc pl-6 text-[#F1F0FB]/80">
                <li>Personnaliser votre expérience</li>
                <li>Améliorer nos services</li>
                <li>Vous contacter si nécessaire</li>
                <li>Assurer la sécurité du service</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-medium text-[#F1F0FB]">3. Protection des données</h3>
              <p className="text-[#F1F0FB]/80">
                Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données personnelles :
              </p>
              <ul className="list-disc pl-6 text-[#F1F0FB]/80">
                <li>Chiffrement des données sensibles</li>
                <li>Accès restreint aux données</li>
                <li>Surveillance continue de la sécurité</li>
                <li>Mises à jour régulières des protocoles</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-medium text-[#F1F0FB]">4. Vos droits</h3>
              <p className="text-[#F1F0FB]/80">
                Conformément aux lois sur la protection des données, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 text-[#F1F0FB]/80">
                <li>Accès à vos données</li>
                <li>Rectification des informations</li>
                <li>Suppression de vos données</li>
                <li>Opposition au traitement</li>
                <li>Portabilité des données</li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cookies Dialog */}
      <Dialog>
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
                autoFocus={false}
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
                autoFocus={false}
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
                autoFocus={false}
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
