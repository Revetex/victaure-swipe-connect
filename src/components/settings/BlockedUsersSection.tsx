
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 px-2 h-9"
      >
        <UserX className="h-4 w-4" />
        <span className="text-sm">Utilisateurs bloqués</span>
      </Button>

      <ScrollArea className="h-[200px] rounded-lg border bg-muted/50">
        <div className="p-4 space-y-2">
          {blockedUsers?.map((item) => (
            <div key={item.blocked.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.blocked.avatar_url || ''} />
                  <AvatarFallback>{item.blocked.full_name?.[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{item.blocked.full_name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUnblock(item.blocked.id, item.blocked.full_name)}
                className="h-8 px-2"
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
  );
}
