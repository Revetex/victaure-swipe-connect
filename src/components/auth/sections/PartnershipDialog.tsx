
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Handshake } from "lucide-react";

export function PartnershipDialog() {
  return (
    <DialogContent className="sm:max-w-md bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB] flex items-center gap-2">
          <Handshake className="h-5 w-5 text-[#64B5D9]" />
          Partenariat Victaure
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 text-[#F1F0FB]">
        <div className="text-center space-y-2">
          <p className="font-medium text-[#64B5D9]">Thomas Blanchet</p>
          <p>Développement / Conception</p>
          <p>Email: tblanchet@hotmail.com</p>
          <p>Tél: +1(819) 668-0473</p>
        </div>
        <div className="flex justify-center">
          <div className="bg-white p-2 rounded-lg shadow-lg">
            <img src="/lovable-uploads/color-logo.png" alt="Victaure Logo" className="w-12 h-12 opacity-90" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#4A90E2]/10 to-[#64B5D9]/10 p-4 rounded-lg border border-[#64B5D9]/20">
          <h4 className="font-medium mb-2">Avantages du Partenariat</h4>
          <ul className="text-sm space-y-2 text-[#F1F0FB]/90">
            {[
              "Accès prioritaire aux nouvelles fonctionnalités",
              "Support dédié 24/7",
              "Formations personnalisées gratuites",
              "Événements exclusifs partenaires"
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#64B5D9]" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DialogContent>
  );
}
