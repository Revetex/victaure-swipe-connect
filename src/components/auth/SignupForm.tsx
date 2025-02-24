
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
        <h1 className="text-2xl font-semibold tracking-tight text-[#F1F0FB]">
          Créez votre compte
        </h1>
        <p className="text-sm text-[#F1F0FB]/80">
          Mr. Victaure vous accompagne dans votre inscription
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nom complet</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-[#F1F0FB]/60" />
            <Input
              id="fullName"
              placeholder="Jean Dupont"
              type="text"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              disabled={loading}
              className="pl-10 bg-[#1B2A4A]/40 border-[#64B5D9]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40 focus:border-[#64B5D9] focus:ring-1 focus:ring-[#64B5D9] transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-[#F1F0FB]/60" />
            <Input
              id="phone"
              placeholder="+1 (555) 555-5555"
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              disabled={loading}
              className="pl-10 bg-[#1B2A4A]/40 border-[#64B5D9]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40 focus:border-[#64B5D9] focus:ring-1 focus:ring-[#64B5D9] transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-signup">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-[#F1F0FB]/60" />
            <Input
              id="email-signup"
              placeholder="nom@exemple.com"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={loading}
              className="pl-10 bg-[#1B2A4A]/40 border-[#64B5D9]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40 focus:border-[#64B5D9] focus:ring-1 focus:ring-[#64B5D9] transition-all"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password-signup">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-[#F1F0FB]/60" />
            <Input
              id="password-signup"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={loading}
              className="pl-10 bg-[#1B2A4A]/40 border-[#64B5D9]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40 focus:border-[#64B5D9] focus:ring-1 focus:ring-[#64B5D9] transition-all"
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
              className="text-sm font-medium leading-none text-[#F1F0FB]/80"
            >
              Mr. Victaure m'assure que j'accepte la{" "}
              <Dialog>
                <DialogTrigger className="text-[#64B5D9] hover:underline">
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
                        <li>Adresse e-mail professionnelle</li>
                        <li>Numéro de téléphone</li>
                        <li>Informations professionnelles</li>
                      </ul>

                      <h2 className="text-lg font-semibold mt-6">2. Utilisation des données</h2>
                      <p>Vos données sont utilisées pour :</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Personnaliser votre expérience</li>
                        <li>Améliorer nos services</li>
                        <li>Vous contacter concernant votre compte</li>
                        <li>Assurer la sécurité de la plateforme</li>
                      </ul>

                      <h2 className="text-lg font-semibold mt-6">3. Protection des données</h2>
                      <p>Nous mettons en œuvre des mesures de sécurité pour protéger vos informations.</p>

                      <h2 className="text-lg font-semibold mt-6">4. Vos droits</h2>
                      <p>Vous disposez des droits suivants :</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Accès à vos données</li>
                        <li>Rectification des informations</li>
                        <li>Suppression de compte</li>
                        <li>Opposition au traitement</li>
                      </ul>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              {" "}et les{" "}
              <Dialog>
                <DialogTrigger className="text-[#64B5D9] hover:underline">
                  conditions d'utilisation
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Conditions d'utilisation</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4 p-4 text-sm">
                      <h2 className="text-lg font-semibold">1. Acceptation des conditions</h2>
                      <p>En utilisant notre plateforme, vous acceptez les présentes conditions.</p>

                      <h2 className="text-lg font-semibold mt-6">2. Utilisation du service</h2>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Créez un compte unique</li>
                        <li>Fournissez des informations exactes</li>
                        <li>Respectez les règles de la communauté</li>
                      </ul>

                      <h2 className="text-lg font-semibold mt-6">3. Sécurité</h2>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Protection de vos identifiants</li>
                        <li>Signalement des activités suspectes</li>
                        <li>Respect de la confidentialité</li>
                      </ul>

                      <h2 className="text-lg font-semibold mt-6">4. Responsabilités</h2>
                      <p>Vous êtes responsable de toutes les activités sous votre compte.</p>

                      <h2 className="text-lg font-semibold mt-6">5. Modifications</h2>
                      <p>Nous pouvons modifier ces conditions à tout moment.</p>
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
        className="w-full bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white transition-all duration-300 font-medium shadow-sm hover:shadow-md"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Créer un compte"
        )}
      </Button>

      <p className="text-sm text-[#F1F0FB]/60 text-center">
        Mr. Victaure vous remercie de votre confiance
      </p>
    </motion.div>
  );
}
