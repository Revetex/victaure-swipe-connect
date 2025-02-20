
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Message } from "@/types/messages";

interface AssistantMessageContentProps {
  message: Message;
  suggestedJobs: any[];
  onJobAccept?: (jobId: string) => Promise<void>;
  onJobReject?: (jobId: string) => void;
}

export function AssistantMessageContent({ 
  message, 
  suggestedJobs,
  onJobAccept,
  onJobReject 
}: AssistantMessageContentProps) {
  if (message.thinking) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>En train de réfléchir...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
      
      {suggestedJobs.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-primary">Offres d'emploi pertinentes :</p>
          {suggestedJobs.map((job: any) => (
            <Card key={job.id} className="p-3 bg-background/50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-sm">{job.title}</h4>
                  <p className="text-xs text-muted-foreground">{job.company}</p>
                  {job.location && (
                    <p className="text-xs text-muted-foreground mt-1">{job.location}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onJobReject?.(job.id)}
                    className="h-8 w-8 p-0"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onJobAccept?.(job.id)}
                    className="h-8 w-8 p-0"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
