
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ContactDialogProps {
  onClose: () => void;
}

export function ContactDialog({ onClose }: ContactDialogProps) {
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
      onClose();
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
      console.error(error);
    }
  };

  return (
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
  );
}
