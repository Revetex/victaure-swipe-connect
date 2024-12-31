import { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CategoryIcon } from "./skills/CategoryIcon";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full hover:shadow-lg transition-all duration-200 bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <motion.h3 
              className="font-semibold leading-none tracking-tight text-lg text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h3>
            {company && (
              <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {company}
              </motion.p>
            )}
          </div>
          <CategoryIcon category={category} className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <motion.div 
            className="flex flex-wrap gap-2 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 transition-colors">
              {location}
            </Badge>
            {displaySalary && (
              <Badge variant="secondary" className="bg-green-500/10 hover:bg-green-500/20 transition-colors">
                {displaySalary}
              </Badge>
            )}
            <Badge variant="secondary" className="bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
              {contract_type}
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
              {experience_level}
            </Badge>
          </motion.div>
          
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

          <motion.p 
            className="text-sm text-muted-foreground line-clamp-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {description}
          </motion.p>
          
          {created_at && (
            <motion.p 
              className="text-xs text-muted-foreground"
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