import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ThemeSelector } from "./ThemeSelector";

export const AuthForm = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!formData.fullName || !formData.phone) {
          toast.error("Veuillez remplir tous les champs");
          return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
            },
          },
        });
        
        if (signUpError) throw signUpError;
        
        toast.success("Inscription réussie ! Vérifiez vos emails.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (!session) {
          throw new Error("No session after login");
        }

        navigate("/dashboard");
        toast.success("Connexion réussie !");
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      if (error.message.includes('Email not confirmed')) {
        toast.error("Veuillez confirmer votre email avant de vous connecter");
        return;
      }
      
      if (error.message.includes('Invalid login credentials')) {
        toast.error("Email ou mot de passe incorrect");
        return;
      }
      
      if (error.message.includes('Email already registered')) {
        toast.error("Cette adresse email est déjà utilisée");
        return;
      }
      
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error("Veuillez entrer votre adresse email");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email);
      if (error) throw error;
      toast.success("Instructions envoyées par email");
    } catch (error: any) {
      toast.error("Impossible d'envoyer l'email de réinitialisation");
    }
  };

  return (
    <div className="space-y-6">
      <ThemeSelector />

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <>
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Nom complet
              </label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Votre nom complet"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Numéro de téléphone
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Votre numéro de téléphone"
                required
              />
            </div>
          </>
        )}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Votre adresse email"
            required
            autoFocus={!isSignUp}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Mot de passe
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Votre mot de passe"
            required
          />
        </div>

        {!isSignUp && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="link"
              className="text-xs text-muted-foreground hover:text-primary px-0"
              onClick={handleForgotPassword}
            >
              <KeyRound className="mr-1 h-3 w-3" />
              Mot de passe oublié ?
            </Button>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-11 text-sm font-medium transition-all hover:-translate-y-[1px]"
          disabled={loading}
        >
          {loading ? "Chargement..." : isSignUp ? "S'inscrire" : "Se connecter"}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className="w-full text-sm text-muted-foreground hover:text-primary"
      >
        {isSignUp
          ? "Vous avez déjà un compte ? Connectez-vous"
          : "Vous n'avez pas de compte ? Inscrivez-vous"}
      </button>
    </div>
  );
};