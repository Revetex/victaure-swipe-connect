
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SettingsSection } from "./SettingsSection";
import { Separator } from "@/components/ui/separator";

export function BlockedUsersSection() {
  const { data: blockedUsers, refetch } = useQuery({
    queryKey: ["blocked-users"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: blocked, error } = await supabase
        .from("blocked_users")
        .select(`
          blocked:profiles!blocked_users_blocked_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("blocker_id", user.id);

      if (error) throw error;
      return blocked;
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
    <SettingsSection>
      <div className="w-full space-y-1">
        <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
          <UserX className="h-4 w-4" />
          <span className="text-sm font-medium">Utilisateurs bloqués</span>
        </div>
        
        <ScrollArea className="h-[180px] w-full rounded-md border border-border/50 bg-muted/30">
          <div className="p-2 space-y-1">
            {blockedUsers?.map((item) => (
              <div 
                key={item.blocked.id} 
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={item.blocked.avatar_url || ''} />
                    <AvatarFallback>{item.blocked.full_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{item.blocked.full_name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnblock(item.blocked.id, item.blocked.full_name)}
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
      </div>
    </SettingsSection>
  );
}
