import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase, DollarSign } from "lucide-react";
import type { Job } from "@/types/job";

interface JobSwipeCardProps {
  job: Job;
}

export function JobSwipeCard({ job }: JobSwipeCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.location}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {job.contract_type}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {job.experience_level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <DollarSign className="h-5 w-5 text-primary" />
            {new Intl.NumberFormat('fr-CA', {
              style: 'currency',
              currency: 'CAD'
            }).format(Number(job.budget))}
          </div>
          <p className="text-muted-foreground">
            {job.description}
          </p>
          {job.subcategory && (
            <Badge variant="secondary">
              {job.subcategory}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}