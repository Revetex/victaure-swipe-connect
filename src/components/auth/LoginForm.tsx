import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export function LoginForm({
  email,
  password,
  loading,
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

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-login">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email-login"
              placeholder="nom@exemple.com"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={loading}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password-login">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password-login"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={loading}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={loading || !email || !password}
        className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] transition-all duration-300 text-white font-medium shadow-sm hover:shadow-md hover:scale-[1.02]"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Se connecter"
        )}
      </Button>
    </motion.div>
  );
}