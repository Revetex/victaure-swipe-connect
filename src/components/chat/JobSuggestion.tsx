
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, BuildingIcon, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface JobSuggestionProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    url: string;
    skills?: string[];
  };
  onAccept: (jobId: string) => void;
  onReject: (jobId: string) => void;
}

export function JobSuggestion({ job, onAccept, onReject }: JobSuggestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="my-2"
    >
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{job.title}</h3>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <BuildingIcon className="w-4 h-4" />
            <span>{job.company}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onReject(job.id)}
              className="text-destructive hover:bg-destructive/10"
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              Pas intéressé
            </Button>
            <Button 
              size="sm"
              onClick={() => onAccept(job.id)}
              className="bg-primary text-primary-foreground"
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              Postuler
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
