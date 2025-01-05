import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function VCardCreationForm() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          role: role || 'professional'
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Profil créé avec succès!");
      navigate(0);
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error("Erreur lors de la création du profil");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 p-6 bg-card rounded-lg shadow-lg">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Créez votre profil</h1>
        <p className="text-muted-foreground">
          Remplissez ces informations pour commencer
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium">
            Nom complet
          </label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            Rôle professionnel
          </label>
          <Input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="ex: Développeur Full Stack"
          />
        </div>

        <Button type="submit" className="w-full">
          Créer mon profil
        </Button>
      </form>
    </div>
  );
}