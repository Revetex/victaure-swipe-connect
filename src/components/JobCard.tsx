import { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CategoryIcon } from "./skills/CategoryIcon";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type JobCardProps = Job;

export function JobCard({ 
  title, 
  company, 
  location, 
  salary, 
  category,
  contract_type,
  experience_level,
  description,
  created_at,
  images,
  budget
}: JobCardProps) {
  const displaySalary = salary || (budget ? `${budget} CAD` : undefined);
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
          {company && (
            <p className="text-sm text-muted-foreground">{company}</p>
          )}
        </div>
        <CategoryIcon category={category} className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{location}</Badge>
          {displaySalary && (
            <Badge variant="outline">{displaySalary}</Badge>
          )}
          <Badge variant="outline">{contract_type}</Badge>
          <Badge variant="outline">{experience_level}</Badge>
        </div>
        
        {images && images.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {images.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Image ${index + 1} pour ${title}`}
                className="w-24 h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        {created_at && (
          <p className="text-xs text-muted-foreground mt-4">
            Publié {formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: fr })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}