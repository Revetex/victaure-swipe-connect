import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { SignupInput } from "./inputs/SignupInput";
import { TermsDialog } from "./dialogs/TermsDialog";
import { PrivacyDialog } from "./dialogs/PrivacyDialog";
import { useState } from "react";

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

      <div className="space-y-4">
        <SignupInput
          id="fullName"
          label="Nom complet"
          placeholder="Jean Dupont"
          type="text"
          value={fullName}
          onChange={onFullNameChange}
          disabled={loading}
          Icon={User}
        />

        <SignupInput
          id="phone"
          label="Téléphone"
          placeholder="+1 (555) 555-5555"
          type="tel"
          value={phone}
          onChange={onPhoneChange}
          disabled={loading}
          Icon={Phone}
        />

        <SignupInput
          id="email-signup"
          label="Email"
          placeholder="nom@exemple.com"
          type="email"
          value={email}
          onChange={onEmailChange}
          disabled={loading}
          Icon={Mail}
        />

        <SignupInput
          id="password-signup"
          label="Mot de passe"
          placeholder=""
          type="password"
          value={password}
          onChange={onPasswordChange}
          disabled={loading}
          Icon={Lock}
        />

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              En créant un compte, j'accepte les{" "}
              <TermsDialog />
              {" "}et la{" "}
              <PrivacyDialog />
            </label>
          </div>
        </div>
      </div>

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