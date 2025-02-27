
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { CookiesDialog } from "./dialogs/CookiesDialog";
import { TermsDialog } from "./dialogs/TermsDialog";
import { PrivacyDialog } from "./dialogs/PrivacyDialog";
import { ContactDialog } from "./dialogs/ContactDialog";
import { Shield, FileText, Cookie, Mail } from "lucide-react";

export function AuthFooterLinks() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isCookiesOpen, setIsCookiesOpen] = useState(false);

  const links = [
    {
      label: "Conditions d'utilisation",
      icon: <FileText className="h-3 w-3" />,
      dialog: <TermsDialog />,
      state: isTermsOpen,
      setState: setIsTermsOpen
    },
    {
      label: "Politique de confidentialité",
      icon: <Shield className="h-3 w-3" />,
      dialog: <PrivacyDialog />,
      state: isPrivacyOpen,
      setState: setIsPrivacyOpen
    },
    {
      label: "Cookies",
      icon: <Cookie className="h-3 w-3" />,
      dialog: <CookiesDialog />,
      state: isCookiesOpen,
      setState: setIsCookiesOpen
    },
    {
      label: "Contact",
      icon: <Mail className="h-3 w-3" />,
      dialog: <ContactDialog onClose={() => setIsContactOpen(false)} />,
      state: isContactOpen,
      setState: setIsContactOpen
    }
  ];

  return (
    <nav className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3 text-sm px-4" role="navigation">
      {links.map((link) => (
        <Dialog key={link.label} open={link.state} onOpenChange={link.setState}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full sm:w-auto text-[#F1F0FB]/60 hover:text-[#F1F0FB] hover:bg-white/5 font-light flex items-center gap-2"
            >
              {link.icon}
              <span className="text-xs">{link.label}</span>
            </Button>
          </DialogTrigger>
          {link.dialog}
        </Dialog>
      ))}
    </nav>
  );
}
