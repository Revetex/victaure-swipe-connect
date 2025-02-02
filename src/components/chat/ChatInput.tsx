import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mic, Send, Loader2, Paperclip, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
  isThinking?: boolean;
  className?: string;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onVoiceInput,
  isListening = false,
  isThinking = false,
  className,
  placeholder = "Comment puis-je vous aider aujourd'hui ?",
}: ChatInputProps) {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((value.trim() || attachments.length > 0) && !isThinking && !isUploading) {
        handleSend();
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = [
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      toast.error("Certains fichiers ne sont pas supportés. Formats acceptés: images et documents PDF/Word");
      return;
    }
    
    setAttachments(prev => [...prev, ...validFiles]);
  };

  const uploadFiles = async () => {
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of attachments) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('chat_attachments')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('chat_attachments')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      // Add file URLs to the message
      const fileLinks = uploadedUrls
        .map(url => `\n[Fichier joint](${url})`)
        .join('\n');
      
      onChange(value + fileLinks);
      setAttachments([]);
      onSend();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error("Erreur lors de l'envoi des fichiers");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSend = async () => {
    if (attachments.length > 0) {
      await uploadFiles();
    } else {
      onSend();
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("flex flex-col gap-0.5 relative", className)}>
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-lg mb-2">
          {attachments.map((file, index) => (
            <div 
              key={index}
              className="flex items-center gap-1 bg-background px-2 py-1 rounded-full text-xs"
            >
              <span className="truncate max-w-[100px]">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-destructive/20"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="relative w-full">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pr-24 min-h-[36px] max-h-[120px] resize-none text-foreground focus-visible:ring-primary bg-background w-full text-sm rounded-lg"
          disabled={isThinking || isUploading}
        />
        <div className="absolute bottom-1 right-1 flex items-center gap-0.5">
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="h-7 w-7 hover:bg-muted/80"
            disabled={isThinking || isUploading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          {onVoiceInput && (
            <Button
              type="button"
              size="icon"
              variant={isListening ? "default" : "ghost"}
              onClick={onVoiceInput}
              className="h-7 w-7 hover:bg-muted/80"
              disabled={isThinking || isUploading}
            >
              <motion.div
                animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Mic className="h-4 w-4" />
              </motion.div>
            </Button>
          )}
          
          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            className={cn(
              "h-7 w-7 transition-transform bg-primary hover:bg-primary/90",
              (value.trim() || attachments.length > 0) && !isThinking && !isUploading && "hover:scale-105"
            )}
            disabled={(!value.trim() && attachments.length === 0) || isThinking || isUploading}
          >
            {isThinking || isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Send className="h-4 w-4 text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}