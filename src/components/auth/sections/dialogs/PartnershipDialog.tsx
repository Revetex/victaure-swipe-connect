
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PartnershipDialogProps {
  contactInfo: {
    name: string;
    title: string;
    email: string;
    tel: string;
  };
  vCardData: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PartnershipDialog({ contactInfo, vCardData, open, onOpenChange }: PartnershipDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB]">Partenariat Victaure</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-[#F1F0FB]">
          <div className="text-center space-y-2">
            <p className="font-medium text-[#64B5D9]">{contactInfo.name}</p>
            <p>{contactInfo.title}</p>
            <p>Email: {contactInfo.email}</p>
            <p>Tél: {contactInfo.tel}</p>
          </div>

          <div className="flex justify-center">
            <div className="bg-white p-2 rounded-lg shadow-lg relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img src="/lovable-uploads/color-logo.png" alt="Victaure Logo" className="w-12 h-12 opacity-90" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#4A90E2]/10 to-[#64B5D9]/10 p-4 rounded-lg border border-[#64B5D9]/20">
            <h4 className="font-medium mb-2">Avantages du Partenariat</h4>
            <ul className="text-sm space-y-2 text-[#F1F0FB]/90">
              <li>• Accès prioritaire aux nouvelles fonctionnalités</li>
              <li>• Support dédié 24/7</li>
              <li>• Formations personnalisées gratuites</li>
              <li>• Événements exclusifs partenaires</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
