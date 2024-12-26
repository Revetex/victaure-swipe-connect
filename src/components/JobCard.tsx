import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building2, MapPin, Calendar } from "lucide-react";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  duration: string;
  skills: string[];
}

export function JobCard({
  title,
  company,
  location,
  salary,
  duration,
  skills,
}: JobCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="space-y-2">
          <h3 className="font-semibold text-xl text-foreground">{title}</h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{company}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-lg font-semibold text-victaure-green">{salary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-muted text-muted-foreground"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}