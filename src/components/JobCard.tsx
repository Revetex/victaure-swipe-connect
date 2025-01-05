import { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CategoryIcon } from "./skills/CategoryIcon";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { JobBadges } from "./jobs/badges/JobBadges";

type JobCardProps = Job;

export function JobCard(props: JobCardProps) {
  const { 
    title, 
    company,
    company_name,
    company_website,
    company_description,
    category,
    description,
    created_at,
    images,
    salary,
    budget,
    required_skills = [],
    preferred_skills = [],
    is_scraped
  } = props;
  
  const displaySalary = salary || (budget ? `${budget} CAD` : undefined);
  const displayCompany = company || company_name || "Entreprise";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className={`w-full hover:shadow-lg transition-all duration-200 bg-card/50 backdrop-blur-sm border-primary/10 group-hover:border-primary/30 ${is_scraped ? 'border-blue-500/20' : ''}`}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <motion.h3 
              className="font-semibold leading-none tracking-tight text-lg text-foreground group-hover:text-primary transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
              {is_scraped && (
                <Badge variant="secondary" className="ml-2 bg-blue-500/10 text-xs">
                  IA
                </Badge>
              )}
            </motion.h3>
            {displayCompany && (
              <motion.div 
                className="flex items-center gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Building2 className="h-4 w-4" />
                <span>{displayCompany}</span>
                {company_website && (
                  <a 
                    href={company_website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Site web
                  </a>
                )}
              </motion.div>
            )}
          </div>
          <CategoryIcon category={category || 'Technology'} className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <JobBadges job={props} displaySalary={displaySalary} />
          
          {images && images.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/30">
              {images.map((imageUrl, index) => (
                <motion.img
                  key={index}
                  src={imageUrl}
                  alt={`Image ${index + 1} pour ${title}`}
                  className="w-24 h-24 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
          )}

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
            {company_description && (
              <p className="text-sm text-muted-foreground line-clamp-2 italic">
                {company_description}
              </p>
            )}

            {(required_skills.length > 0 || preferred_skills.length > 0) && (
              <div className="mt-4 space-y-2">
                {required_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {required_skills.map((skill, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="bg-red-500/10 hover:bg-red-500/20 text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
                {preferred_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {preferred_skills.map((skill, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="bg-blue-500/10 hover:bg-blue-500/20 text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
          
          {created_at && (
            <motion.p 
              className="text-xs text-muted-foreground mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Publié {formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: fr })}
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}