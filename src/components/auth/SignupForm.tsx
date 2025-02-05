import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
              <Dialog>
                <DialogTrigger className="text-primary hover:underline">
                  conditions générales d'utilisation
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Conditions générales d'utilisation</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4 p-4 text-sm">
                      <h2 className="text-lg font-semibold">1. Acceptation des conditions</h2>
                      <p>En accédant à ce site, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.</p>

                      <h2 className="text-lg font-semibold">2. Licence d'utilisation</h2>
                      <p>Une licence limitée, non exclusive et non transférable vous est accordée pour accéder et utiliser le site.</p>

                      <h2 className="text-lg font-semibold">3. Compte utilisateur</h2>
                      <p>Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe.</p>

                      <h2 className="text-lg font-semibold">4. Limitations de responsabilité</h2>
                      <p>Nous ne serons pas tenus responsables des dommages directs, indirects, accessoires ou consécutifs.</p>

                      <h2 className="text-lg font-semibold">5. Modifications du service</h2>
                      <p>Nous nous réservons le droit de modifier ou d'interrompre le service sans préavis.</p>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              {" "}et la{" "}
              <Dialog>
                <DialogTrigger className="text-primary hover:underline">
                  politique de confidentialité
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Politique de confidentialité</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4 p-4 text-sm">
                      <h2 className="text-lg font-semibold">1. Collecte des informations</h2>
                      <p>Nous collectons les informations suivantes :</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Nom et prénom</li>
                        <li>Adresse e-mail</li>
                        <li>Numéro de téléphone</li>
                        <li>Informations professionnelles</li>
                      </ul>

                      <h2 className="text-lg font-semibold">2. Utilisation des informations</h2>
                      <p>Les informations collectées sont utilisées pour :</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Personnaliser l'expérience utilisateur</li>
                        <li>Améliorer notre service</li>
                        <li>Communiquer avec vous concernant votre compte</li>
                      </ul>

                      <h2 className="text-lg font-semibold">3. Protection des informations</h2>
                      <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles.</p>

                      <h2 className="text-lg font-semibold">4. Cookies</h2>
                      <p>Nous utilisons des cookies pour améliorer l'expérience utilisateur et analyser notre trafic.</p>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
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
