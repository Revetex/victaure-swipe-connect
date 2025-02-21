
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LotoDraw, LotoTicket } from "@/types/lottery";
import { toast } from "sonner";

export function useLotoSphere() {
  const queryClient = useQueryClient();

  const { data: currentDraw, isLoading: isLoadingDraw } = useQuery({
    queryKey: ["currentDraw"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loto_draws")
        .select("*")
        .eq("status", "pending")
        .order("scheduled_for", { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;
      return data as LotoDraw;
    }
  });

  const { data: myTickets = [], isLoading: isLoadingTickets } = useQuery({
    queryKey: ["myTickets", currentDraw?.id],
    queryFn: async () => {
      if (!currentDraw?.id) return [];
      
      const { data, error } = await supabase
        .from("loto_tickets")
        .select("*")
        .eq("draw_id", currentDraw.id);

      if (error) throw error;
      return data as LotoTicket[];
    },
    enabled: !!currentDraw?.id
  });

  const { data: numberStats = {} } = useQuery({
    queryKey: ["numberStats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loto_number_stats")
        .select("*");

      if (error) throw error;
      
      return data.reduce((acc, stat) => {
        acc[stat.number] = stat;
        return acc;
      }, {});
    }
  });

  const buyTicketMutation = useMutation({
    mutationFn: async ({ numbers, color }: { numbers: number[]; color: string }) => {
      if (!currentDraw) throw new Error("Pas de tirage en cours");

      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error("Vous devez être connecté");

      // Vérifier le portefeuille
      const { data: wallet, error: walletError } = await supabase
        .from("user_wallets")
        .select("balance")
        .eq("user_id", profile.user.id)
        .single();

      if (walletError) throw walletError;
      if (!wallet || wallet.balance < 5) {
        throw new Error("Solde insuffisant");
      }

      // Créer le ticket
      const { data: ticket, error: ticketError } = await supabase
        .from("loto_tickets")
        .insert([{
          user_id: profile.user.id,
          draw_id: currentDraw.id,
          selected_numbers: numbers,
          bonus_color: color,
          price: 5
        }])
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Mettre à jour le portefeuille
      const { error: updateError } = await supabase
        .from("user_wallets")
        .update({ balance: wallet.balance - 5 })
        .eq("user_id", profile.user.id);

      if (updateError) throw updateError;

      return ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTickets"] });
      queryClient.invalidateQueries({ queryKey: ["userWallet"] });
      toast.success("Ticket acheté avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  return {
    currentDraw,
    myTickets,
    numberStats,
    isLoading: isLoadingDraw || isLoadingTickets,
    buyTicket: buyTicketMutation.mutate
  };
}
