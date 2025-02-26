
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, UserCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface SignupFormProps {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  loading: boolean;
  redirectTo?: string;
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
  redirectTo,
  onEmailChange,
  onPasswordChange,
  onFullNameChange,
  onPhoneChange,
  onSubmit
}: SignupFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[#F1F0FB]">
          Créez votre compte
        </h1>
        <p className="text-sm text-[#F1F0FB]/80">
          Commencez votre voyage avec nous dès maintenant
        </p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName-signup" className="text-[#F1F0FB]">Nom complet</Label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-3 h-4 w-4 text-[#F1F0FB]/60" />
            <Input
              id="fullName-signup"
              name="fullName"
              type="text"
              placeholder="Jean Dupont"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              disabled={loading}
              className="pl-10 bg-[#F1F0FB]/10 border-[#F1F0FB]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-signup" className="text-[#F1F0FB]">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-[#F1F0FB]/60" />
            <Input
              id="email-signup"
              name="email"
              type="email"
              placeholder="nom@exemple.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={loading}
              className="pl-10 bg-[#F1F0FB]/10 border-[#F1F0FB]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone-signup" className="text-[#F1F0FB]">Téléphone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-[#F1F0FB]/60" />
            <Input
              id="phone-signup"
              name="phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              disabled={loading}
              className="pl-10 bg-[#F1F0FB]/10 border-[#F1F0FB]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password-signup" className="text-[#F1F0FB]">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-[#F1F0FB]/60" />
            <Input
              id="password-signup"
              name="password"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={loading}
              className="pl-10 bg-[#F1F0FB]/10 border-[#F1F0FB]/20 text-[#F1F0FB]"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !email || !password || !fullName || !phone}
          className="w-full bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white transition-colors duration-200 font-medium mt-6"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Création en cours...</span>
            </>
          ) : (
            "Créer mon compte"
          )}
        </Button>
      </form>
    </motion.div>
  );
}
