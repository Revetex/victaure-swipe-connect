import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JobBadges } from "./badges/JobBadges";
import { cn } from "@/lib/utils";
import { Job } from "@/types/job";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useJobBids } from "@/hooks/useJobBids";
import { MapPin } from "@/components/ui/map-pin";
import { GoogleMap } from "@/components/ui/google-map";

interface JobCardProps {
  job: Job;
  onDeleted?: () => void;
}

export function JobCard({ job, onDeleted }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const { bids, placeBid } = useJobBids(job.id);
  const [markers, setMarkers] = useState<Array<{
    position: google.maps.LatLngLiteral;
    title?: string;
  }>>([]);

  useEffect(() => {
    if (job.latitude && job.longitude) {
      setMarkers([
        {
          position: { lat: job.latitude, lng: job.longitude },
          title: job.title
        }
      ]);
    }
  }, [job]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount) return;
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount)) return;
    
    if (job.min_bid && amount < job.min_bid) return;
    if (job.max_bid && amount > job.max_bid) return;
    
    await placeBid(amount);
    setBidAmount("");
  };

  const isValidBid = () => {
    const amount = parseFloat(bidAmount);
    if (isNaN(amount)) return false;
    if (job.min_bid && amount < job.min_bid) return false;
    if (job.max_bid && amount > job.max_bid) return false;
    return true;
  };

  return (
    <Card className={cn(
      "relative p-6 transition-all",
      "md:hover:shadow-lg md:hover:scale-[1.02]",
      "active:scale-[0.98] cursor-pointer",
      expanded ? "bg-card/50" : ""
    )}>
      <motion.div 
        layout
        onClick={() => setExpanded(!expanded)}
        className="space-y-4"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {job.company || "Entreprise non spécifiée"}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.city || job.location || "Lieu non spécifié"}</span>
          </div>
        </div>

        <JobBadges job={job} />

        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {job.description}
            </p>

            {job.latitude && job.longitude && (
              <GoogleMap
                apiKey={process.env.GOOGLE_MAPS_API_KEY || ""}
                markers={markers}
                center={{ lat: job.latitude, lng: job.longitude }}
                className="h-[200px] mt-4"
              />
            )}

            {job.accept_bids && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium">Enchères</h4>
                    {job.bid_end_date && (
                      <p className="text-sm text-muted-foreground">
                        Se termine dans {formatDistanceToNow(new Date(job.bid_end_date), { locale: fr })}
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleBidSubmit} className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`${job.min_bid || 0} - ${job.max_bid || "∞"} CAD`}
                      className="w-full sm:w-32 px-3 py-1 rounded-md border"
                      step="0.01"
                      min={job.min_bid || 0}
                      max={job.max_bid || undefined}
                    />
                    <Button 
                      type="submit"
                      disabled={!isValidBid()}
                      className="whitespace-nowrap"
                    >
                      Placer une enchère
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
}
