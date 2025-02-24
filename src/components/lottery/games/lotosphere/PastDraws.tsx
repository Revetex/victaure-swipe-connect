
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { History, Loader2 } from "lucide-react";

interface CompletedDraw {
  id: string;
  draw_numbers: number[];
  bonus_color: string;
  completed_at: string;
}

export function PastDraws() {
  const [draws, setDraws] = useState<CompletedDraw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const { data, error } = await supabase
          .from('loto_draws')
          .select('id, draw_numbers, bonus_color, completed_at')
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        if (data) {
          setDraws(data.map(draw => ({
            id: draw.id,
            draw_numbers: draw.draw_numbers,
            bonus_color: draw.bonus_color,
            completed_at: draw.completed_at
          })));
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
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
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
            <div
              key={draw.id}
              className="p-4 rounded-lg border bg-card text-card-foreground"
            >
              <p className="font-medium">
                {draw.draw_numbers.join(' - ')}
              </p>
              <p className="text-sm text-muted-foreground">
                Bonus: {draw.bonus_color}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {format(new Date(draw.completed_at), 'PPpp', { locale: fr })}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
