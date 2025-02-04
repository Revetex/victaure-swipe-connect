import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (type: 'login' | 'signup') => {
    try {
      setLoading(true);

      let result;
      if (type === 'signup') {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/auth/callback'
          }
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password
        });
      }

      const { error } = result;

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error("Veuillez confirmer votre email avant de vous connecter");
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error("Email ou mot de passe incorrect");
        } else if (error.message.includes('User already registered')) {
          toast.error("Un compte existe déjà avec cet email");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (type === 'signup') {
        toast.success("Inscription réussie! Veuillez vérifier votre email");
      } else {
        toast.success("Connexion réussie!");
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('Auth error:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg border shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Bienvenue sur Victaure
        </h1>
        <p className="text-sm text-muted-foreground">
          Connectez-vous ou créez un compte pour continuer
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            id="email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Input
            id="password"
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => handleAuth('login')}
          disabled={loading || !email || !password}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Se connecter"
          )}
        </Button>
        
        <Button
          onClick={() => handleAuth('signup')}
          variant="outline"
          disabled={loading || !email || !password}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Créer un compte"
          )}
        </Button>
      </div>
    </div>
  );
}