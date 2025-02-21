
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LotoDraw, LotoTicket } from "@/types/lottery";
import { toast } from "sonner";

export function useLotoSphere() {
  const queryClient = useQueryClient();

  const { data: currentDraw, isLoading: isLoadingDraw, error: drawError } = useQuery({
    queryKey: ["currentDraw"],
    queryFn: async () => {
      console.log("Fetching current draw...");
      const { data, error } = await supabase
        .from("loto_draws")
        .select("*")
        .eq("status", "pending")
        .order("scheduled_for", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching draw:", error);
        throw error;
      }
      
      console.log("Current draw data:", data);
      return data as LotoDraw;
    },
  });

  const { data: myTickets = [], isLoading: isLoadingTickets, error: ticketsError } = useQuery({
    queryKey: ["myTickets", currentDraw?.id],
    queryFn: async () => {
      console.log("Fetching tickets for draw:", currentDraw?.id);
      if (!currentDraw?.id) return [];
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("loto_tickets")
        .select("*")
        .eq("draw_id", currentDraw.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching tickets:", error);
        throw error;
      }

      console.log("Tickets data:", data);
      return data as LotoTicket[];
    },
    enabled: !!currentDraw?.id
  });

  const { data: numberStats = {}, error: statsError } = useQuery({
    queryKey: ["numberStats"],
    queryFn: async () => {
      console.log("Fetching number stats...");
      const { data, error } = await supabase
        .from("loto_number_stats")
        .select("*");

      if (error) {
        console.error("Error fetching stats:", error);
        throw error;
      }
      
      console.log("Number stats data:", data);
      return data.reduce((acc: any, stat) => {
        acc[stat.number] = stat;
        return acc;
      }, {});
    }
  });

  const buyTicketMutation = useMutation({
    mutationFn: async ({ numbers, color }: { numbers: number[]; color: string }) => {
      if (!currentDraw) throw new Error("Pas de tirage en cours");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté");

      // Vérifier le portefeuille
      const { data: wallet, error: walletError } = await supabase
        .from("user_wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (walletError) throw walletError;
      if (!wallet || wallet.balance < 5) {
        throw new Error("Solde insuffisant");
      }

      // Créer le ticket
      const { data: ticket, error: ticketError } = await supabase
        .from("loto_tickets")
        .insert([{
          user_id: user.id,
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
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      return ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTickets"] });
      queryClient.invalidateQueries({ queryKey: ["userWallet"] });
      toast.success("Ticket acheté avec succès !");
    }
  });

  const error = drawError || ticketsError || statsError;

  return {
    currentDraw,
    myTickets,
    numberStats,
    isLoading: isLoadingDraw || isLoadingTickets,
    error,
    buyTicket: buyTicketMutation.mutate
  };
}
