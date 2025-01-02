import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          toast.error("Les mots de passe ne correspondent pas");
          return;
        }

        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const phone = formData.get("phone") as string;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              phone: phone,
            },
          },
        });

        if (error) throw error;
        
        toast.success("Inscription réussie!");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success("Connexion réussie!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignUp ? "Inscription" : "Connexion"}</CardTitle>
        <CardDescription>
          {isSignUp
            ? "Créez votre compte pour commencer"
            : "Connectez-vous à votre compte"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  disabled={isLoading}
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={isLoading}
            />
          </div>
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                disabled={isLoading}
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Chargement..."
              : isSignUp
              ? "S'inscrire"
              : "Se connecter"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={isLoading}
          >
            {isSignUp
              ? "Déjà un compte ? Se connecter"
              : "Pas de compte ? S'inscrire"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}