
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface JobBid {
  id: string;
  amount: number;
  currency: string;
  message: string | null;
  created_at: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  bidder?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface JobBidsListProps {
  bids: JobBid[];
  onAcceptBid?: (bidId: string) => void;
}

export function JobBidsList({ bids, onAcceptBid }: JobBidsListProps) {
  if (!bids?.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Aucune offre pour le moment
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <Card key={bid.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={bid.bidder?.avatar_url || ''} />
                <AvatarFallback>
                  {bid.bidder?.full_name?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{bid.bidder?.full_name || 'Anonyme'}</p>
                <p className="text-sm text-muted-foreground">
                  {bid.created_at && formatDistanceToNow(new Date(bid.created_at), {
                    addSuffix: true,
                    locale: fr
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{bid.amount} {bid.currency}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {bid.status}
              </p>
            </div>
          </div>
          {bid.message && (
            <p className="mt-3 text-sm">{bid.message}</p>
          )}
        </Card>
      ))}
    </div>
  );
}
