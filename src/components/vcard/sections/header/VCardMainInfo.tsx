import { Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobTitles } from "@/data/jobTitles";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VCardMainInfoProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardMainInfo({ profile, isEditing, setProfile }: VCardMainInfoProps) {
  const { toast } = useToast();

  const handleRoleChange = async (value: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: value })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, role: value });
      
      toast({
        title: "Succès",
        description: "Profession mise à jour",
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la profession",
      });
    }
  };

  return (
    <div className="space-y-2 w-full text-center sm:text-left">
      <div className="space-y-1">
        {isEditing ? (
          <Input
            value={profile.full_name || ""}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            className="text-base font-semibold"
            placeholder="Votre nom"
          />
        ) : (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold"
          >
            {profile.full_name || "Nom non défini"}
          </motion.h2>
        )}
      </div>
      <div className="flex items-center justify-center sm:justify-start gap-1.5">
        <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
        {isEditing ? (
          <Select
            value={profile.role || ""}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger className="w-full max-w-[250px] h-8 text-sm">
              <SelectValue placeholder="Sélectionnez un titre" />
            </SelectTrigger>
            <SelectContent>
              {jobTitles.map((title) => (
                <SelectItem key={title} value={title}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground"
          >
            {profile.role || "Titre non défini"}
          </motion.span>
        )}
      </div>
    </div>
  );
}