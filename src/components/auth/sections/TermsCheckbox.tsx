import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TermsDialog } from "../dialogs/TermsDialog";
import { PrivacyDialog } from "../dialogs/PrivacyDialog";

interface TermsCheckboxProps {
  acceptedTerms: boolean;
  onAcceptTerms: (accepted: boolean) => void;
}

export function TermsCheckbox({ acceptedTerms, onAcceptTerms }: TermsCheckboxProps) {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={acceptedTerms}
          onCheckedChange={(checked) => onAcceptTerms(checked as boolean)}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          J'accepte la{" "}
          <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
            <DialogTrigger className="text-primary hover:underline">
              politique de confidentialité
            </DialogTrigger>
            <PrivacyDialog />
          </Dialog>
          {" "}et les{" "}
          <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
            <DialogTrigger className="text-primary hover:underline">
              conditions d'utilisation
            </DialogTrigger>
            <TermsDialog />
          </Dialog>
        </label>
      </div>
    </div>
  );
}