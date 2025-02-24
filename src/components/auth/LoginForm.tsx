
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  redirectTo?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export function LoginForm({
  email,
  password,
  loading,
  redirectTo,
  onEmailChange,
  onPasswordChange,
  onSubmit
}: LoginFormProps) {
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
          Connectez-vous à votre compte
        </h1>
        <p className="text-sm text-[#F1F0FB]/80">
          Entrez vos identifiants pour accéder à votre espace
        </p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-login" className="text-[#F1F0FB]">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-[#F1F0FB]/60" aria-hidden="true" />
            <Input
              id="email-login"
              name="email"
              type="email"
              placeholder="nom@exemple.com"
              autoComplete="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={loading}
              className="pl-10 bg-[#1B2A4A]/40 border-[#64B5D9]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40 focus:border-[#64B5D9] focus:ring-1 focus:ring-[#64B5D9] transition-all"
              required
              aria-required="true"
              aria-label="Adresse email"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password-login" className="text-[#F1F0FB]">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-[#F1F0FB]/60" aria-hidden="true" />
            <Input
              id="password-login"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={loading}
              className="pl-10 bg-[#1B2A4A]/40 border-[#64B5D9]/20 text-[#F1F0FB] focus:border-[#64B5D9] focus:ring-1 focus:ring-[#64B5D9] transition-all"
              required
              aria-required="true"
              aria-label="Mot de passe"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white transition-colors duration-200 font-medium h-11"
          aria-label={loading ? "Connexion en cours..." : "Se connecter"}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
              <span>Connexion...</span>
            </>
          ) : (
            "Se connecter"
          )}
        </Button>
      </form>
    </motion.div>
  );
}
