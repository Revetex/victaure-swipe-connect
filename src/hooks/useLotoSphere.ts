
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LotoDraw, LotoTicket } from "@/types/lottery";
import { toast } from "sonner";

export function useLotoSphere() {
  const queryClient = useQueryClient();

  const { data: currentDraw, isLoading: isLoadingDraw, error: drawError } = useQuery({
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
    },
  });

  const { data: userWallet = null, isLoading: isLoadingWallet } = useQuery({
    queryKey: ["userWallet"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("user_wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: myTickets = [], isLoading: isLoadingTickets, error: ticketsError } = useQuery({
    queryKey: ["myTickets", currentDraw?.id],
    queryFn: async () => {
      if (!currentDraw?.id) return [];
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("loto_tickets")
        .select("*")
        .eq("draw_id", currentDraw.id)
        .eq("user_id", user.id);

      if (error) throw error;
      return data as LotoTicket[];
    },
    enabled: !!currentDraw?.id
  });

  const { data: numberStats = {}, error: statsError } = useQuery({
    queryKey: ["numberStats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loto_number_stats")
        .select("*");

      if (error) throw error;
      
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
        .select("balance, currency")
        .eq("user_id", user.id)
        .single();

      if (walletError) throw walletError;
      if (!wallet || wallet.balance < 5) {
        throw new Error("Solde insuffisant");
      }

      // Mise à jour du solde et de la cagnotte
      const { error: updateError } = await supabase.rpc('process_loto_ticket_purchase', {
        p_user_id: user.id,
        p_amount: 5,
        p_draw_id: currentDraw.id
      });

      if (updateError) throw updateError;

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

      return ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTickets"] });
      queryClient.invalidateQueries({ queryKey: ["userWallet"] });
      queryClient.invalidateQueries({ queryKey: ["currentDraw"] });
      toast.success("Ticket acheté avec succès !");
    }
  });

  const error = drawError || ticketsError || statsError;
  const isLoading = isLoadingDraw || isLoadingTickets || isLoadingWallet;

  return {
    currentDraw,
    myTickets,
    numberStats,
    userWallet,
    isLoading,
    error,
    buyTicket: buyTicketMutation.mutate
  };
}
