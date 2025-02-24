
import { Clock, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

interface NextDrawProps {
  draw: {
    scheduled_for: string;
    prize_pool: number;
  };
}

export function NextDraw({ draw }: NextDrawProps) {
  const drawDate = new Date(draw.scheduled_for);
  
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h3 className="text-xl font-semibold text-center">
            Cagnotte actuelle
          </h3>
        </div>

        <p className="text-4xl font-bold text-center text-primary">
          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CAD' }).format(draw.prize_pool)}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              {format(drawDate, 'EEEE dd MMMM yyyy', { locale: fr })}
            </p>
          </div>
          <p className="text-center text-lg font-semibold">
            {format(drawDate, 'HH:mm', { locale: fr })}
          </p>
          <p className="text-sm text-center text-muted-foreground">
            Dans {formatDistanceToNow(drawDate, { locale: fr })}
          </p>
        </div>
      </div>
    </Card>
  );
}
