
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { CookiesDialog } from "./dialogs/CookiesDialog";
import { TermsDialog } from "./dialogs/TermsDialog";
import { PrivacyDialog } from "./dialogs/PrivacyDialog";
import { ContactDialog } from "./dialogs/ContactDialog";

export function AuthFooterLinks() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isCookiesOpen, setIsCookiesOpen] = useState(false);

  return (
    <nav className="flex flex-wrap justify-center gap-3 text-sm text-[#F1F0FB]/80" role="navigation">
      {/* Terms Dialog */}
      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB] font-thin">
            Conditions d'utilisation
          </Button>
        </DialogTrigger>
        <TermsDialog />
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB] font-thin">
            Politique de confidentialité
          </Button>
        </DialogTrigger>
        <PrivacyDialog />
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
        <ContactDialog onClose={() => setIsContactOpen(false)} />
      </Dialog>
    </nav>
  );
}
