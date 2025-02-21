
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function LotoHistory() {
  const { data: history = [], isLoading } = useQuery({
    queryKey: ["lotoHistory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loto_draws")
        .select("*")
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement de l'historique...</div>;
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Derniers tirages
      </h3>

      <ScrollArea className="h-[200px] sm:h-[300px] w-full rounded-md border p-2">
        <div className="space-y-2">
          {history.map((draw) => (
            <div key={draw.id} className="bg-muted/50 p-2 rounded-lg flex justify-between items-center">
              <div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(draw.completed_at), "d MMMM yyyy à HH:mm", { locale: fr })}
                </div>
                <div className="flex gap-1 mt-1">
                  {draw.draw_numbers.map((num: number) => (
                    <Badge key={num} variant="outline" className="h-6 w-6 flex items-center justify-center">
                      {num}
                    </Badge>
                  ))}
                  <Badge 
                    className={`h-6 flex items-center gap-1 ${
                      draw.bonus_color === 'Rouge' ? 'bg-red-500' :
                      draw.bonus_color === 'Vert' ? 'bg-green-500' :
                      draw.bonus_color === 'Bleu' ? 'bg-blue-500' :
                      draw.bonus_color === 'Jaune' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}
                  >
                    <Star className="h-3 w-3" />
                  </Badge>
                </div>
              </div>
              <Badge variant="secondary">
                {draw.prize_pool.toLocaleString()} CAD$
              </Badge>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
