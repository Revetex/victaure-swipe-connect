
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ConnectionsSection } from "./ConnectionsSection";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const handleProfileSelect = async (profile: UserProfile) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existingRequest } = await supabase
      .from("friend_requests")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.id})`)
      .maybeSingle();

    if (existingRequest) {
      toast.error("Une demande d'ami existe déjà avec ce profil");
      return;
    }

    const { error } = await supabase
      .from("friend_requests")
      .insert({
        sender_id: user.id,
        receiver_id: profile.id,
        status: "pending"
      });

    if (error) {
      console.error("Error sending friend request:", error);
      toast.error("Erreur lors de l'envoi de la demande d'ami");
      return;
    }

    toast.success("Demande d'ami envoyée avec succès");
  };

  return (
    <ScrollArea className="h-screen">
      <div className="container mx-auto px-4 py-6 max-w-3xl w-full space-y-8 overflow-x-hidden min-h-screen pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "bg-card/50 backdrop-blur-sm",
            "border rounded-xl shadow-lg",
            "p-4 lg:p-6 space-y-4",
            "mt-16 sm:mt-6"
          )}
        >
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
            Trouver des connections
          </h2>
          <div className="w-full">
            <ProfileSearch 
              onSelect={handleProfileSelect}
              placeholder="Rechercher par nom..."
              className="w-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="touch-manipulation w-full"
        >
          <ConnectionsSection />
        </motion.div>
      </div>
    </ScrollArea>
  );
}
