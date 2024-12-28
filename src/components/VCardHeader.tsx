import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, X, Briefcase, User, Upload } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
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
      className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative group">
          <Avatar className="h-20 w-20 ring-2 ring-background">
            <AvatarImage 
              src={profile.avatar_url} 
              alt={profile.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-muted">
              <User className="h-8 w-8 text-muted-foreground/50" />
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <label 
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200"
              htmlFor="avatar-upload"
            >
              <Upload className="h-6 w-6 text-white" />
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
        <div className="space-y-2">
          <div className="text-2xl font-bold text-foreground">
            {isEditing ? (
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="text-2xl font-bold"
                placeholder="Votre nom"
              />
            ) : (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {profile.name || "Nom non défini"}
              </motion.h2>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            {isEditing ? (
              <Select
                value={profile.title}
                onValueChange={(value) => setProfile({ ...profile, title: value })}
              >
                <SelectTrigger className="w-[250px]">
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
              >
                {profile.title || "Titre non défini"}
              </motion.span>
            )}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditing(!isEditing)}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
      </Button>
    </motion.div>
  );
}