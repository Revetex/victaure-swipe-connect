import { Bot, User, Briefcase, Building2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface AIMessageCardProps {
  message: {
    type: string;
    content: any;
  };
}

export function AIMessageCard({ message }: AIMessageCardProps) {
  const navigate = useNavigate();

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
          <div className="space-y-2">
            <p>{message.content.message}</p>
            {message.content.jobs && (
              <div className="mt-2 space-y-2">
                {message.content.jobs.map((job: any, i: number) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <Briefcase className="h-4 w-4" />
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Building2 className="h-3 w-3" />
                        <span>{job.company}</span>
                        {job.required_skills && job.required_skills.length > 0 && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-0.5 rounded">
                            {job.required_skills[0]}
                            {job.required_skills.length > 1 && ` +${job.required_skills.length - 1}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {message.content.suggestedActions && (
              <div className="flex flex-wrap gap-2 mt-2">
                {message.content.suggestedActions.map((action: any, i: number) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(action.type, action.data)}
                    className="flex items-center gap-1"
                  >
                    {action.icon === 'briefcase' && <Briefcase className="h-3 w-3" />}
                    {action.icon === 'user' && <User className="h-3 w-3" />}
                    {action.icon === 'graduation-cap' && <GraduationCap className="h-3 w-3" />}
                    {action.label}
                  </Button>
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