import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AuthFormHeader } from "./form/AuthFormHeader";
import { SignUpFields } from "./form/SignUpFields";
import { PasswordField } from "./form/PasswordField";

export const AuthForm = () => {
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

        const { error: profileError } = await supabase
          .from('profiles')
          .update({ phone: formData.phone })
          .eq('id', (await supabase.auth.getUser()).data.user?.id);

        if (profileError) throw profileError;
        
        toast.success("Inscription réussie ! Vérifiez vos emails.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      if (error.message.includes('refresh_token_not_found') || 
          error.message.includes('Invalid Refresh Token')) {
        localStorage.clear();
        sessionStorage.clear();
        toast.error("Session invalide. Veuillez vous reconnecter.");
        return;
      }
      
      toast.error(error.message);
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
      toast.error(error.message);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative space-y-4">
      <AuthFormHeader />

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <SignUpFields
            fullName={formData.fullName}
            phone={formData.phone}
            onChange={handleFieldChange}
          />
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="Votre adresse email"
            required
          />
        </div>

        <PasswordField
          value={formData.password}
          onChange={(value) => handleFieldChange('password', value)}
        />

        {!isSignUp && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="link"
              className="text-xs text-muted-foreground hover:text-primary px-0"
              onClick={handleForgotPassword}
            >
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