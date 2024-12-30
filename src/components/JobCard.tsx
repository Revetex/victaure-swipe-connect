import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building2, MapPin, Calendar, Briefcase, GraduationCap, FolderOpen, List } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <Card className="glass-card w-full overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#9b87f5] via-[#7E69AB] to-[#6E59A5] dark:from-[#b4a4f7] dark:via-[#9b87f5] dark:to-[#8a76f3]" />
        <CardHeader className="space-y-3 pb-3">
          <h3 className="font-semibold text-xl text-foreground line-clamp-2 leading-tight">{title}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#9b87f5] dark:text-[#b4a4f7]" />
              <span className="truncate">{company}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#9b87f5] dark:text-[#b4a4f7]" />
              <span className="truncate">{location}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#9b87f5] dark:text-[#b4a4f7]" />
              <span>{contract_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-[#9b87f5] dark:text-[#b4a4f7]" />
              <span>{experience_level}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-[#9b87f5] dark:text-[#b4a4f7]" />
              <span>{category}</span>
            </div>
            {subcategory && (
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-[#9b87f5] dark:text-[#b4a4f7]" />
                <span>{subcategory}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salary && (
              <div className="flex flex-col gap-2">
                <p className="text-lg font-semibold text-[#9b87f5] dark:text-[#b4a4f7]">{salary}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, isMobile ? 3 : 5).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-[#F1F0FB] dark:bg-[#2A2438] text-[#7E69AB] dark:text-[#b4a4f7] hover:bg-[#E5DEFF] dark:hover:bg-[#352B47] transition-colors"
                >
                  {skill}
                </Badge>
              ))}
              {skills.length > (isMobile ? 3 : 5) && (
                <Badge 
                  variant="outline"
                  className="border-[#9b87f5] dark:border-[#b4a4f7] text-[#9b87f5] dark:text-[#b4a4f7]"
                >
                  +{skills.length - (isMobile ? 3 : 5)}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}