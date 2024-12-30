import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building2, MapPin, Calendar, Briefcase, GraduationCap, FolderOpen, List } from "lucide-react";
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

  return (
    <Card className={`w-full ${isMobile ? 'mx-0' : 'max-w-md mx-auto'} min-h-[300px] shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800`}>
      <CardHeader className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg md:text-xl text-gray-900 dark:text-white line-clamp-2">{title}</h3>
          <div className="flex flex-wrap gap-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{company}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm md:text-base">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Briefcase className="h-4 w-4 shrink-0" />
              <span>{contract_type}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <GraduationCap className="h-4 w-4 shrink-0" />
              <span>{experience_level}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FolderOpen className="h-4 w-4 shrink-0" />
              <span>{category}</span>
            </div>
            {subcategory && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <List className="h-4 w-4 shrink-0" />
                <span>{subcategory}</span>
              </div>
            )}
          </div>

          {salary && (
            <div className="pt-1">
              <p className="text-base md:text-lg font-medium text-victaure-blue">{salary}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {skills.slice(0, isMobile ? 2 : 3).map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm py-1"
              >
                {skill}
              </Badge>
            ))}
            {skills.length > (isMobile ? 2 : 3) && (
              <Badge 
                variant="outline" 
                className="dark:text-gray-200 text-sm py-1"
              >
                +{skills.length - (isMobile ? 2 : 3)}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}