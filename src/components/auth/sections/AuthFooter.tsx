import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function AuthFooter() {
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
    <footer className="mt-24 w-full max-w-xl mx-auto px-4 text-center" role="contentinfo">
      <div className="space-y-8 border-t border-[#F2EBE4]/10 pt-8">
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-[#F2EBE4]/60" role="navigation">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-[#F2EBE4]/60 hover:text-[#F2EBE4]">
                Conditions d'utilisation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-[#F2EBE4]">Conditions d'utilisation</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-[#F2EBE4]/60 hover:text-[#F2EBE4]">
                Politique de confidentialité
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-[#F2EBE4]">Politique de confidentialité</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-[#F2EBE4]/60 hover:text-[#F2EBE4]">
                Politique des cookies
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-[#F2EBE4]">Politique des cookies</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="link" 
                className="text-sm text-[#F2EBE4]/60 hover:text-[#F2EBE4]"
                title="Ouvrir le formulaire de contact"
              >
                Nous contacter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#1B2A4A] border-2 border-black">
              <DialogHeader>
                <DialogTitle className="text-[#F2EBE4]">Contactez-nous</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-sm font-medium text-[#F2EBE4]">
                    Nom
                  </label>
                  <Input
                    id="contact-name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-[#F2EBE4] text-[#1B2A4A]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-[#F2EBE4]">
                    Email
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-[#F2EBE4] text-[#1B2A4A]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-sm font-medium text-[#F2EBE4]">
                    Message
                  </label>
                  <Textarea
                    id="contact-message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="bg-[#F2EBE4] text-[#1B2A4A] min-h-[100px]"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-[#F2EBE4]"
                >
                  Envoyer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </nav>

        <div className="text-sm text-[#F2EBE4]/60">
          <p>© 2025 Victaure Technologies inc.</p>
        </div>
      </div>
    </footer>
  );
}
