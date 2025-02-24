
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PaymentProps } from "@/types/payment";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Loader2, Sparkles, Trophy } from "lucide-react";
import { NextDraw } from "./NextDraw";
import { PlayForm } from "./PlayForm";
import { PastDraws } from "./PastDraws";
import { MyTickets } from "./MyTickets";

interface Draw {
  id: string;
  scheduled_for: string;
  prize_pool: number;
  status: string;
  draw_numbers?: number[];
  bonus_color?: string;
}

export function LotoSphere({ onPaymentRequested }: PaymentProps) {
  const [nextDraw, setNextDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  const fetchNextDraw = async () => {
    try {
      const { data, error } = await supabase
        .from('loto_draws')
        .select('*')
        .eq('status', 'pending')
        .order('scheduled_for', { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;
      if (data) {
        setNextDraw({
          id: data.id,
          scheduled_for: data.scheduled_for,
          prize_pool: Number(data.prize_pool),
          status: data.status,
          draw_numbers: data.draw_numbers || undefined,
          bonus_color: data.bonus_color || undefined
        });
      }
    } catch (error) {
      console.error('Error fetching next draw:', error);
      toast.error("Erreur lors de la récupération du prochain tirage");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextDraw();

    const channel = supabase
      .channel('loto_draws')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'loto_draws' }, 
        () => {
          fetchNextDraw();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handlePlayTicket = async (numbers: number[], color: string) => {
    if (!nextDraw) {
      toast.error("Aucun tirage disponible");
      return;
    }

    setBuying(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour acheter un ticket");
        return;
      }

      await onPaymentRequested(5, "Ticket LotoSphere");

      const { error } = await supabase
        .from('loto_tickets')
        .insert({
          draw_id: nextDraw.id,
          selected_numbers: numbers,
          bonus_color: color,
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;
      toast.success("Ticket acheté avec succès!");
    } catch (error) {
      console.error('Error buying ticket:', error);
      toast.error("Erreur lors de l'achat du ticket");
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 bg-[#1A1F2C] rounded-xl p-6 glass-morphism"
      >
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2 text-gradient">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </motion.div>
          LotoSphere
          <motion.div
            animate={{ rotate: [0, -15, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </motion.div>
        </h2>
        <p className="text-lg text-white/60">
          Tentez votre chance au tirage quotidien !
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {nextDraw && (
          <motion.div
            key="next-draw"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <NextDraw draw={nextDraw} />
            <PlayForm onSubmit={handlePlayTicket} isSubmitting={buying} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <MyTickets />
        <PastDraws />
      </motion.div>
    </div>
  );
}
