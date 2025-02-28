
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Mail, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PartnershipContactDialog({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    partnershipType: "enterprise" as "enterprise" | "recruiter" | "startup"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: { ...formData, subject: "Nouvelle demande de partenariat" }
      });
      
      if (error) throw error;
      
      toast.success("Votre demande de partenariat a été envoyée avec succès!");
      onClose();
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi de votre demande");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold mb-4 text-[#F1F0FB] flex items-center gap-2">
          Devenir Partenaire Victaure
        </DialogTitle>
      </DialogHeader>
      
      <div className="mb-6 space-y-2">
        <p className="text-[#F1F0FB]/80">
          Rejoignez notre écosystème d'innovation et bénéficiez d'avantages exclusifs adaptés à vos besoins.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-[#64B5D9]/20 text-[#64B5D9]">
            Intelligence Artificielle
          </Badge>
          <Badge variant="secondary" className="bg-[#64B5D9]/20 text-[#64B5D9]">
            Recrutement Innovant
          </Badge>
          <Badge variant="secondary" className="bg-[#64B5D9]/20 text-[#64B5D9]">
            Réseau Professionnel
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-[#F1F0FB]">
              Nom complet*
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-[#64B5D9]" />
              <Input
                id="name"
                required
                placeholder="Votre nom"
                value={formData.name}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                className="bg-[#1B2A4A]/50 border-[#64B5D9]/20 text-[#F1F0FB] pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium text-[#F1F0FB]">
              Entreprise*
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-[#64B5D9]" />
              <Input
                id="company"
                required
                placeholder="Nom de votre entreprise"
                value={formData.company}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  company: e.target.value
                }))}
                className="bg-[#1B2A4A]/50 border-[#64B5D9]/20 text-[#F1F0FB] pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#F1F0FB]">
              Email professionnel*
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-[#64B5D9]" />
              <Input
                id="email"
                type="email"
                required
                placeholder="votre@email.com"
                value={formData.email}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                className="bg-[#1B2A4A]/50 border-[#64B5D9]/20 text-[#F1F0FB] pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-[#F1F0FB]">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-[#64B5D9]" />
              <Input
                id="phone"
                type="tel"
                placeholder="Votre numéro"
                value={formData.phone}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
                className="bg-[#1B2A4A]/50 border-[#64B5D9]/20 text-[#F1F0FB] pl-10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-[#F1F0FB]">
            Message*
          </label>
          <Textarea
            id="message"
            required
            placeholder="Décrivez vos objectifs et vos besoins..."
            value={formData.message}
            onChange={e => setFormData(prev => ({
              ...prev,
              message: e.target.value
            }))}
            className="min-h-[100px] bg-[#1B2A4A]/50 border-[#64B5D9]/20 text-[#F1F0FB]"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-[#F1F0FB]/70 hover:text-[#F1F0FB] hover:bg-white/5"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
