import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, X, Search, User, Briefcase, Building2, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AIAssistantProps {
  onClose: () => void;
}

export function AIAssistant({ onClose }: AIAssistantProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: string; content: any }>>([]);
  const navigate = useNavigate();

  const systemContext = {
    platform: {
      type: "job_platform",
      features: [
        "job_search",
        "job_posting",
        "profile_management",
        "career_advice",
        "skill_assessment"
      ],
      userTypes: ["professional", "employer"],
    },
    capabilities: [
      "search_jobs",
      "analyze_profile",
      "provide_career_advice",
      "assist_with_job_posting",
      "skill_recommendations",
      "market_insights"
    ]
  };

  const handleAction = (action: string, data?: any) => {
    switch (action) {
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
        console.log('Action non reconnue:', action);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour utiliser l'assistant");
        return;
      }

      // Add user message to chat
      setMessages(prev => [...prev, { type: 'user', content: input }]);
      
      // Get user profile for better context
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Get recent jobs for context
      const { data: recentJobs } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Call AI assistant function with enhanced context
      const { data, error } = await supabase.functions.invoke('ai-job-assistant', {
        body: { 
          message: input,
          userId: user.id,
          context: {
            systemContext,
            previousMessages: messages.slice(-5),
            userProfile: profile,
            recentJobs,
            currentAction: input.toLowerCase().includes('cherche') ? 'search_jobs' : 
                         input.toLowerCase().includes('conseil') ? 'career_advice' :
                         input.toLowerCase().includes('profil') ? 'analyze_profile' :
                         input.toLowerCase().includes('créer') ? 'create_job' :
                         'general_assistance',
            userIntent: {
              isSearching: input.toLowerCase().includes('cherche') || input.toLowerCase().includes('trouve'),
              isAsking: input.toLowerCase().includes('comment') || input.toLowerCase().includes('pourquoi'),
              needsAdvice: input.toLowerCase().includes('conseil') || input.toLowerCase().includes('aide'),
              wantsToCreate: input.toLowerCase().includes('créer') || input.toLowerCase().includes('poster'),
            }
          }
        }
      });

      if (error) throw error;

      // Add AI response to chat
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: {
          ...data,
          suggestedActions: data.suggestedActions || []
        }
      }]);

      // Handle any suggested actions
      if (data.suggestedActions?.length > 0) {
        data.suggestedActions.forEach((action: any) => {
          handleAction(action.type, action.data);
        });
      }

      setInput("");
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue lors de la communication avec l'assistant");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 lg:p-8"
    >
      <Card className="max-w-2xl mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Assistant Carrière IA</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[400px] p-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-start gap-2 mb-4 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
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
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez vos questions sur l'emploi, les missions, ou demandez des conseils..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Search className="h-4 w-4" />
                </motion.div>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}