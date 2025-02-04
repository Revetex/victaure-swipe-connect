import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { motion } from "framer-motion";

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
        <div className="space-y-2">
          <Label htmlFor="fullName">Nom complet</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              placeholder="Jean Dupont"
              type="text"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              disabled={loading}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              placeholder="+1 (555) 555-5555"
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              disabled={loading}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-signup">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email-signup"
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
          <Label htmlFor="password-signup">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password-signup"
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
        disabled={loading || !email || !password || !fullName}
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