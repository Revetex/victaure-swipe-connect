import { Job } from "@/types/job";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { 
  Building2, 
  MapPin, 
  Calendar,
  Briefcase,
  DollarSign,
  Clock,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "./ui/button";

interface JobCardProps extends Omit<Job, 'source'> {
  source?: "Victaure" | "Externe";
}

export function JobCard({
  title,
  company,
  location,
  budget,
  created_at,
  contract_type,
  source = "Externe",
  status,
  url
}: JobCardProps) {
  const handleExternalLink = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Building2 className="h-4 w-4" />
              <span>{company}</span>
            </div>
          </div>
          <Badge variant={source === "Victaure" ? "default" : "secondary"}>
            {source}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          
          {budget > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>{budget} CAD</span>
            </div>
          )}

          {contract_type && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{contract_type}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(created_at), 'PP', { locale: fr })}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Badge variant="outline">{status}</Badge>
          
          {url && source === "Externe" && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleExternalLink}
              className="text-blue-500 hover:text-blue-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Voir l'offre
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}