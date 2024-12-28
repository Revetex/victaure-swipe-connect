import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building2, MapPin, Calendar, Briefcase, GraduationCap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  category: string;
  contract_type: string;
  experience_level: string;
  skills: string[];
}

export function JobCard({
  title,
  company,
  location,
  salary,
  category,
  contract_type,
  experience_level,
  skills,
}: JobCardProps) {
  const isMobile = useIsMobile();

  return (
    <Card className={`w-full ${isMobile ? 'mx-0' : 'max-w-md mx-auto'} shadow-lg hover:shadow-xl transition-shadow`}>
      <CardHeader>
        <div className="space-y-2">
          <h3 className="font-semibold text-xl text-foreground line-clamp-2">{title}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{company}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 shrink-0" />
              <span>{contract_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 shrink-0" />
              <span>{experience_level}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold text-victaure-green">{salary}</p>
            <Badge variant="secondary" className="w-fit">
              {category}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, isMobile ? 3 : 5).map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-muted text-muted-foreground"
              >
                {skill}
              </Badge>
            ))}
            {skills.length > (isMobile ? 3 : 5) && (
              <Badge variant="outline">+{skills.length - (isMobile ? 3 : 5)}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}