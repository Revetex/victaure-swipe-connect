
import React, { KeyboardEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isThinking?: boolean;
  isListening?: boolean;
  onVoiceInput?: () => void;
  onFileAttach?: (file: File) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isThinking,
  isListening,
  onVoiceInput,
  onFileAttach,
  placeholder = "Écrivez votre message...",
  disabled = false
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("Le fichier est trop volumineux (max 10MB)");
        return;
      }
      
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error("Type de fichier non supporté");
        return;
      }

      onFileAttach?.(file);
    }
  };

  return (
    <div className="flex items-end gap-2 bg-background rounded-lg p-2">
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
      />

      <Button
        size="icon"
        variant="ghost"
        onClick={() => fileInputRef.current?.click()}
        className="rounded-full h-10 w-10"
        disabled={isThinking || disabled}
      >
        <Paperclip className="h-5 w-5" />
      </Button>

      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full resize-none bg-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
            "min-h-[44px] max-h-[200px]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{
            height: 'auto',
            minHeight: '44px',
            maxHeight: '200px'
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant={isListening ? "default" : "ghost"}
          onClick={onVoiceInput}
          className="rounded-full h-10 w-10"
          disabled={isThinking || disabled}
        >
          <Mic className={cn("h-5 w-5", isListening && "text-white")} />
        </Button>

        <Button
          size="icon"
          onClick={onSend}
          disabled={!value.trim() || isThinking || disabled}
          className="rounded-full h-10 w-10"
        >
          {isThinking ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
