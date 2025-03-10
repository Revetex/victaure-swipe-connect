
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SettingsSection } from "./SettingsSection";
import { useState } from "react";
import type { BlockedUser } from "@/types/profile";

// Interface à utiliser pour les blocked users venant directement de Supabase
interface BlockedUserResponse {
  id: string;
  blocked_user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function BlockedUsersSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data: blockedUsers, refetch } = useQuery({
    queryKey: ["blocked-users"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: blocked, error } = await supabase
        .from('blocked_users')
        .select(`
          id,
          blocked_user:profiles!blocked_users_blocked_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("blocker_id", user.id);

      if (error) throw error;
      
      // Pour être sûr de renvoyer le bon format
      return (blocked || []) as BlockedUserResponse[];
    }
  });

  const handleUnblock = async (userId: string, userName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('blocker_id', user.id)
        .eq('blocked_id', userId);

      if (error) throw error;
      toast.success(`${userName} a été débloqué`);
      refetch();
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error("Erreur lors du déblocage de l'utilisateur");
    }
  };

  return (
    <SettingsSection title="Utilisateurs bloqués">
      <div className="w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-start gap-2 h-8 px-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <UserX className="h-4 w-4" />
          <span className="flex-1 text-left">Utilisateurs bloqués</span>
          <span className="text-xs text-muted-foreground">
            {blockedUsers?.length || 0}
          </span>
        </Button>

        {isExpanded && (
          <ScrollArea className="h-[180px] w-full mt-2 rounded-md border border-border/50 bg-muted/30">
            <div className="p-2 space-y-1">
              {blockedUsers?.map((item) => (
                <div 
                  key={item.blocked_user.id} 
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={item.blocked_user.avatar_url || ''} />
                      <AvatarFallback>{item.blocked_user.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{item.blocked_user.full_name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnblock(item.blocked_user.id, item.blocked_user.full_name || '')}
                    className="h-7 px-2 text-xs"
                  >
                    Débloquer
                  </Button>
                </div>
              ))}
              {(!blockedUsers || blockedUsers.length === 0) && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Aucun utilisateur bloqué
                </p>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </SettingsSection>
  );
}
