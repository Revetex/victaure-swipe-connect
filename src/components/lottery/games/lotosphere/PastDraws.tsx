
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { History, Loader2, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface CompletedDraw {
  id: string;
  draw_numbers: number[];
  bonus_color: string;
  completed_at: string;
  prize_pool: number;
}

export function PastDraws() {
  const [draws, setDraws] = useState<CompletedDraw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const { data, error } = await supabase
          .from('loto_draws')
          .select('id, draw_numbers, bonus_color, completed_at, prize_pool')
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        if (data) {
          setDraws(data as CompletedDraw[]);
        }
      } catch (error) {
        console.error('Error fetching draws:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDraws();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-6 w-6" />
          </motion.div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
        <History className="h-5 w-5" />
        Derniers tirages
      </h3>
      
      <div className="space-y-4">
        {draws.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Aucun tirage effectué
          </p>
        ) : (
          draws.map(draw => (
            <motion.div
              key={draw.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border bg-gradient-to-br from-card-foreground/5 to-card-foreground/0 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-lg">
                  {draw.draw_numbers.join(' - ')}
                </p>
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>Bonus: {draw.bonus_color}</p>
                <p className="font-medium text-primary">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CAD' }).format(draw.prize_pool)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {format(new Date(draw.completed_at), 'PPpp', { locale: fr })}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
