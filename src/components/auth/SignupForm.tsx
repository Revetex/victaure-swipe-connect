import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { SignupFormFields } from "./sections/SignupFormFields";
import { TermsCheckbox } from "./sections/TermsCheckbox";

interface SignupFormProps {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
}

export function SignupForm({
  email,
  password,
  fullName,
  phone,
  loading,
  onEmailChange,
  onPasswordChange,
  onFullNameChange,
  onPhoneChange,
  onSubmit
}: SignupFormProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Créez votre compte
        </h1>
        <p className="text-sm text-muted-foreground">
          Rejoignez-nous en quelques clics
        </p>
      </div>

      <SignupFormFields
        email={email}
        password={password}
        fullName={fullName}
        phone={phone}
        loading={loading}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
        onFullNameChange={onFullNameChange}
        onPhoneChange={onPhoneChange}
      />

      <TermsCheckbox 
        acceptedTerms={acceptedTerms}
        onAcceptTerms={setAcceptedTerms}
      />

      <Button
        onClick={onSubmit}
        disabled={loading || !email || !password || !fullName || !acceptedTerms}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 font-medium shadow-sm hover:shadow-md"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Créer un compte"
        )}
      </Button>
    </motion.div>
  );
}