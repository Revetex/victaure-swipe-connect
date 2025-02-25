
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function PasswordChangeSection() {
  const [showForm, setShowForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
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
        variant="ghost"
        size="sm"
        onClick={() => setShowForm(true)}
        className="w-full justify-start gap-2 h-8 px-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <Lock className="h-4 w-4" />
        Changer le mot de passe
      </Button>
    );
  }

  return (
    <form onSubmit={handlePasswordChange} className="space-y-3">
      <Input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Nouveau mot de passe"
        className="h-8 text-sm"
        required
      />

      <div className="flex gap-2">
        <Button 
          type="submit" 
          size="sm"
          className="flex-1 h-8"
          disabled={loading}
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
          size="sm"
          onClick={() => setShowForm(false)}
          className="h-8"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
