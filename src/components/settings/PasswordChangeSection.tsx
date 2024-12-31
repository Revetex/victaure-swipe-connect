import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: minLength && hasUpperCase && hasNumber && hasSpecialChar,
    errors: {
      minLength,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
    }
  };
};

export function PasswordChangeSection() {
  const [showForm, setShowForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const validation = validatePassword(newPassword);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validation.isValid) {
      setShowValidation(true);
      toast.error("Le mot de passe ne respecte pas les critères de sécurité");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success("Mot de passe modifié avec succès");
      setNewPassword("");
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      toast.error("Erreur lors du changement de mot de passe");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <Button 
        variant="outline" 
        onClick={() => setShowForm(true)}
        className="w-full"
      >
        <Lock className="h-4 w-4 mr-2" />
        Changer le mot de passe
      </Button>
    );
  }

  return (
    <form onSubmit={handlePasswordChange} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setShowValidation(true);
          }}
          placeholder="Nouveau mot de passe"
          required
          className={showValidation && !validation.isValid ? "border-destructive" : ""}
        />

        {showValidation && (
          <div className="text-xs space-y-1">
            <p className={validation.errors.minLength ? "text-success" : "text-destructive"}>
              ✓ Au moins 8 caractères
            </p>
            <p className={validation.errors.hasUpperCase ? "text-success" : "text-destructive"}>
              ✓ Au moins une majuscule
            </p>
            <p className={validation.errors.hasNumber ? "text-success" : "text-destructive"}>
              ✓ Au moins un chiffre
            </p>
            <p className={validation.errors.hasSpecialChar ? "text-success" : "text-destructive"}>
              ✓ Au moins un caractère spécial
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          type="submit" 
          className="flex-1"
          disabled={loading || !validation.isValid}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Modification...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Confirmer
            </span>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={() => {
            setShowForm(false);
            setNewPassword("");
            setShowValidation(false);
          }}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}