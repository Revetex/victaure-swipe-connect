import { Wand2 } from "lucide-react";
import { Button } from "./button";
import { toast } from "sonner";
import { useState } from "react";

interface AIAssistButtonProps {
  onGeneratedContent: (content: string) => void;
  prompt?: string;
  context?: string;
}

export function AIAssistButton({ 
  onGeneratedContent, 
  prompt = "Write a professional description", 
  context = "" 
}: AIAssistButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, context }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      onGeneratedContent(data.content);
      toast.success('Content generated successfully');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={isLoading}
      className="gap-2 touch-manipulation"
    >
      <Wand2 className="h-4 w-4" />
      {isLoading ? 'Generating...' : 'AI Assist'}
    </Button>
  );
}