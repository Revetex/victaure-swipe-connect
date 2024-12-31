import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Maximize2, X, Briefcase, Upload, UserRound } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobTitles } from "@/data/jobTitles";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface VCardHeaderProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export function VCardHeader({ profile, isEditing, setProfile, setIsEditing }: VCardHeaderProps) {
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Veuillez sélectionner une image",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('vcards')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vcards')
        .getPublicUrl(fileName);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      
      toast({
        title: "Succès",
        description: "Photo de profil mise à jour",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la photo de profil",
      });
    }
  };

  return (
    <motion.div 
      className="flex flex-col sm:flex-row sm:items-start gap-3 relative w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative group mx-auto sm:mx-0">
          <Avatar className="h-16 w-16 ring-2 ring-background">
            <AvatarImage 
              src={profile.avatar_url} 
              alt={profile.full_name}
              className="object-cover"
            />
            <AvatarFallback className="bg-muted">
              <UserRound className="h-6 w-6 text-muted-foreground/50" />
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <label 
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200"
              htmlFor="avatar-upload"
            >
              <Upload className="h-5 w-5 text-white" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          )}
        </div>
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
                onValueChange={(value) => setProfile({ ...profile, role: value })}
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
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-0 right-0 text-muted-foreground hover:text-foreground transition-colors h-8 w-8"
      >
        {isEditing ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </Button>
    </motion.div>
  );
}
