
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface NextDrawProps {
  draw: {
    scheduled_for: string;
    prize_pool: number;
  };
}

export function NextDraw({ draw }: NextDrawProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
          <Clock className="h-5 w-5" />
          Prochain tirage
        </h3>
        <p className="text-3xl font-bold text-primary">
          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CAD' }).format(draw.prize_pool)}
        </p>
        <p className="text-sm text-muted-foreground">
          Dans {formatDistanceToNow(new Date(draw.scheduled_for), { locale: fr })}
        </p>
      </div>
    </Card>
  );
}
