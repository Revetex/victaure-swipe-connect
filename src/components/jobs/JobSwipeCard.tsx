import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Clock, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Job } from "@/types/job";

interface JobSwipeCardProps {
  job: Job;
}

export function JobSwipeCard({ job }: JobSwipeCardProps) {
  return (
    <Card className="w-full bg-card shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{job.title}</h2>
            <div className="flex items-center text-muted-foreground mt-1">
              <Building2 className="h-4 w-4 mr-1" />
              <span className="text-sm">Entreprise XYZ</span>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            {job.contract_type}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {job.category}
          </Badge>
          {job.subcategory && (
            <Badge variant="secondary" className="text-xs">
              {job.subcategory}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            {job.experience_level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {new Intl.NumberFormat('fr-CA', {
                style: 'currency',
                currency: 'CAD'
              }).format(job.budget)}
            </span>
          </div>
        </div>

        <div className="prose prose-sm max-w-none">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {job.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}