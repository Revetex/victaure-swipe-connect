
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDialog({ isOpen, onOpenChange }: ContactDialogProps) {
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
      onOpenChange(false);
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
      console.error(error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
      <DialogHeader>
        <DialogTitle className="text-[#F1F0FB]">Contactez-nous</DialogTitle>
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
            className="bg-white text-[#1B2A4A]" 
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
            className="bg-white text-[#1B2A4A]" 
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
            className="bg-white text-[#1B2A4A] min-h-[100px]" 
            autoFocus={false}
          />
        </div>
        <Button type="submit" className="w-full bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white">
          Envoyer
        </Button>
      </form>
    </DialogContent>
  );
}
