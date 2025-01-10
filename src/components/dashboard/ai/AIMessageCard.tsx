import { Bot, User, Briefcase, Building2, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface AIMessageCardProps {
  message: {
    type: string;
    content: any;
  };
}

export function AIMessageCard({ message }: AIMessageCardProps) {
  const navigate = useNavigate();

  const handleAction = (type: string, data?: any) => {
    switch (type) {
      case 'navigate_to_jobs':
        navigate('/jobs');
        break;
      case 'navigate_to_profile':
        navigate('/profile');
        break;
      case 'create_job':
        navigate('/jobs/create');
        break;
      default:
        console.log('Action non reconnue:', type);
    }
  };

  return (
    <div className={`flex items-start gap-2 mb-4 ${
      message.type === 'user' ? 'justify-end' : 'justify-start'
    }`}>
      {message.type === 'assistant' && (
        <div className="flex-shrink-0">
          <Bot className="h-6 w-6 text-blue-500" />
        </div>
      )}
      
      <div className={`max-w-[80%] p-3 rounded-lg ${
        message.type === 'user'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
      }`}>
        {message.type === 'user' ? (
          <p>{message.content}</p>
        ) : (
          <div className="space-y-4">
            <p className="whitespace-pre-wrap">{message.content.message}</p>
            
            {message.content.suggestedJobs?.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400">
                  Offres d'emploi suggérées :
                </h4>
                {message.content.suggestedJobs.map((job: any, i: number) => (
                  <motion.div 
                    key={job.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col gap-2 p-3 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-500" />
                        <h5 className="font-medium">{job.title}</h5>
                      </div>
                      {job.budget && (
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {job.budget}$
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>{job.company || job.company_name || 'Entreprise'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(job.created_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {job.required_skills && job.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.required_skills.slice(0, 3).map((skill: string) => (
                          <span 
                            key={skill}
                            className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.required_skills.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{job.required_skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {message.type === 'user' && (
        <div className="flex-shrink-0">
          <User className="h-6 w-6 text-white bg-blue-500 rounded-full p-1" />
        </div>
      )}
    </div>
  );
}