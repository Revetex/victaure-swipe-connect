import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, User, Briefcase, Building2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AIMessageCardProps {
  message: {
    type: string;
    content: {
      message: string;
      suggestedJobs?: any[];
    };
  };
}

export function AIMessageCard({ message }: AIMessageCardProps) {
  const isAssistant = message.type === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className="flex-shrink-0">
        {isAssistant ? (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-500" />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4">
        <Card className={`p-4 ${isAssistant ? 'bg-primary/5' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <p className="text-sm whitespace-pre-wrap">{message.content.message}</p>
        </Card>

        {isAssistant && message.content.suggestedJobs && message.content.suggestedJobs.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Offres d'emploi suggérées :
            </h4>
            <div className="grid gap-3">
              {message.content.suggestedJobs.map((job: any) => (
                <Card key={job.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{job.title}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {format(new Date(job.created_at), 'PP', { locale: fr })}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>{job.company_name || 'Entreprise'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Voir l'offre
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}