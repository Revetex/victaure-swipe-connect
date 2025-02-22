
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Connectez-vous à votre compte
        </h1>
        <p className="text-sm text-muted-foreground">
          Entrez vos identifiants pour accéder à votre espace
        </p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-login">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email-login"
              name="email"
              placeholder="nom@exemple.com"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={loading}
              className="pl-10"
              required
              aria-required="true"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password-login">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password-login"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={loading}
              className="pl-10"
              required
              aria-required="true"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 font-medium shadow-sm hover:shadow-md"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Se connecter"
          )}
        </Button>
      </form>
    </motion.div>
  );
}
