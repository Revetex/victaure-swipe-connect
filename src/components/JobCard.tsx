import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building2, MapPin, Briefcase, GraduationCap, FolderOpen, List } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface JobCardProps {
  title: string;
  company?: string;
  location: string;
  salary?: string;
  category: string;
  subcategory?: string;
  contract_type: string;
  experience_level: string;
  skills?: string[];
}

export function JobCard({
  title,
  company = "Entreprise",
  location,
  salary,
  category,
  subcategory,
  contract_type,
  experience_level,
  skills = [],
}: JobCardProps) {
  const isMobile = useIsMobile();

  const InfoItem = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="space-y-2">
          <h3 className="font-semibold text-xl text-foreground line-clamp-2">
            {title}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
            <InfoItem icon={Building2} text={company} />
            <InfoItem icon={MapPin} text={location} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
            <InfoItem icon={Briefcase} text={contract_type} />
            <InfoItem icon={GraduationCap} text={experience_level} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
            <InfoItem icon={FolderOpen} text={category} />
            {subcategory && <InfoItem icon={List} text={subcategory} />}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {salary && (
            <p className="text-lg font-semibold text-primary">{salary}</p>
          )}
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
              <Badge variant="outline">
                +{skills.length - (isMobile ? 3 : 5)}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}