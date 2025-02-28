
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LotoDraw } from "../types";

export function useLotteryDraws() {
  const [nextDraw, setNextDraw] = useState<LotoDraw | null>(null);
  const [lastDraw, setLastDraw] = useState<LotoDraw | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDraws = async () => {
    try {
      const { data: nextDrawData, error: nextError } = await supabase
        .from('loto_draws')
        .select('*')
        .eq('status', 'pending')
        .gt('scheduled_for', new Date().toISOString())
        .order('scheduled_for', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (nextError) throw nextError;

      const { data: lastDrawData, error: lastError } = await supabase
        .from('loto_draws')
        .select('*')
        .eq('status', 'completed')
        .order('scheduled_for', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastError && lastError.code !== 'PGRST116') throw lastError;

      if (nextDrawData) {
        setNextDraw({
          ...nextDrawData,
          status: nextDrawData.status as 'pending' | 'completed'
        });
      }

      if (lastDrawData) {
        setLastDraw({
          ...lastDrawData,
          status: lastDrawData.status as 'pending' | 'completed'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des tirages:', error);
      toast.error("Erreur lors de la récupération des tirages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraws();
    
    const channel = supabase
      .channel('loto_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'loto_draws'
      }, () => {
        fetchDraws();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { nextDraw, lastDraw, loading };
}
