
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Crown, Star } from "lucide-react";
import { ChessPage } from "../../tools/ChessPage";
import { PaymentProps } from "@/types/payment";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

interface LotteryTabsProps extends PaymentProps {
  isMobile: boolean;
}

interface LotoDraw {
  id: string;
  prize_pool: number;
  scheduled_for: string;
  draw_numbers: number[] | null;
  bonus_color: string | null;
  status: 'pending' | 'completed';
}

export function LotteryTabs({
  onPaymentRequested
}: LotteryTabsProps) {
  const [nextDraw, setNextDraw] = useState<LotoDraw | null>(null);
  const [lastDraw, setLastDraw] = useState<LotoDraw | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDraws();
    
    // Configurer une mise à jour en temps réel
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

  const fetchDraws = async () => {
    try {
      // Récupérer le prochain tirage
      const { data: nextDrawData, error: nextError } = await supabase
        .from('loto_draws')
        .select('*')
        .eq('status', 'pending')
        .gt('scheduled_for', new Date().toISOString())
        .order('scheduled_for', { ascending: true })
        .limit(1)
        .single();

      if (nextError) throw nextError;

      // Récupérer le dernier tirage complété
      const { data: lastDrawData, error: lastError } = await supabase
        .from('loto_draws')
        .select('*')
        .eq('status', 'completed')
        .order('scheduled_for', { ascending: false })
        .limit(1)
        .single();

      if (lastError && lastError.code !== 'PGRST116') throw lastError;

      setNextDraw(nextDrawData);
      setLastDraw(lastDrawData);
    } catch (error) {
      console.error('Erreur lors de la récupération des tirages:', error);
      toast.error("Erreur lors de la récupération des tirages");
    } finally {
      setLoading(false);
    }
  };

  const formatTimeToNext = (scheduledFor: string) => {
    return formatDistanceToNow(new Date(scheduledFor), {
      locale: fr,
      addSuffix: true
    });
  };

  return (
    <Tabs defaultValue="lotosphere" className="w-full">
      <TabsList className="w-full bg-[#1B2A4A]/50 border border-[#64B5D9]/10 backdrop-blur-md rounded-xl p-1">
        <TabsTrigger 
          value="lotosphere" 
          className={cn(
            "flex items-center gap-2",
            "data-[state=active]:bg-[#64B5D9]/10",
            "data-[state=active]:text-[#64B5D9]",
            "rounded-lg transition-all duration-300",
            "hover:bg-[#64B5D9]/5"
          )}
        >
          <Star className="h-4 w-4" />
          <span className="font-medium">Lotosphère</span>
        </TabsTrigger>
        <TabsTrigger 
          value="chess" 
          className={cn(
            "flex items-center gap-2",
            "data-[state=active]:bg-[#64B5D9]/10",
            "data-[state=active]:text-[#64B5D9]",
            "rounded-lg transition-all duration-300",
            "hover:bg-[#64B5D9]/5"
          )}
        >
          <Crown className="h-4 w-4" />
          <span className="font-medium">Imperium Chess</span>
        </TabsTrigger>
      </TabsList>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4"
      >
        <TabsContent value="lotosphere">
          <Card className="border-[#64B5D9]/10 bg-[#1B2A4A]/50 backdrop-blur-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#64B5D9]/10">
                  <Trophy className="h-6 w-6 text-[#64B5D9]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#64B5D9]/90 to-[#64B5D9] bg-clip-text text-transparent">
                    Lotosphère
                  </h2>
                  <p className="text-sm text-white/70">
                    Tentez votre chance et gagnez gros !
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {loading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#64B5D9]"></div>
                </div>
              ) : (
                <>
                  {nextDraw && (
                    <div className="rounded-lg border border-[#64B5D9]/10 bg-white/5 p-4">
                      <h3 className="text-lg font-semibold mb-2">Prochain tirage</h3>
                      <p className="text-sm text-white/70">
                        Le prochain tirage aura lieu {formatTimeToNext(nextDraw.scheduled_for)}
                      </p>
                      <p className="text-sm text-[#64B5D9] mt-1">
                        {format(new Date(nextDraw.scheduled_for), 'PPP à HH:mm', { locale: fr })}
                      </p>
                      <div className="mt-4">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2 px-4 bg-[#64B5D9]/20 hover:bg-[#64B5D9]/30 text-[#64B5D9] rounded-lg transition-colors"
                          onClick={() => onPaymentRequested(5, "Lotosphère")}
                        >
                          Acheter un ticket (5 €)
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {lastDraw && lastDraw.draw_numbers && (
                    <div className="rounded-lg border border-[#64B5D9]/10 bg-white/5 p-4">
                      <h3 className="text-lg font-semibold mb-2">Dernier tirage</h3>
                      <div className="flex gap-2">
                        {lastDraw.draw_numbers.map(number => (
                          <div 
                            key={number}
                            className="w-10 h-10 rounded-full bg-[#64B5D9]/10 flex items-center justify-center text-[#64B5D9] font-bold"
                          >
                            {number}
                          </div>
                        ))}
                        {lastDraw.bonus_color && (
                          <div 
                            className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-bold"
                            style={{ backgroundColor: `${lastDraw.bonus_color.toLowerCase()}1a` }}
                          >
                            +
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {nextDraw && (
                    <div className="rounded-lg border border-[#64B5D9]/10 bg-white/5 p-4">
                      <h3 className="text-lg font-semibold mb-2">Cagnotte actuelle</h3>
                      <p className="text-3xl font-bold text-[#64B5D9]">
                        {nextDraw.prize_pool.toFixed(2)}€
                      </p>
                      <p className="text-sm text-white/70 mt-1">
                        La cagnotte augmente à chaque ticket acheté !
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="chess">
          <Card className="border-[#64B5D9]/10 bg-[#1B2A4A]/50 backdrop-blur-md">
            <ChessPage />
          </Card>
        </TabsContent>
      </motion.div>
    </Tabs>
  );
}
