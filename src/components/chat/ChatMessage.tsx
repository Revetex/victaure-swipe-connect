import { MessageBubble } from "./message/MessageBubble";
import { JobCreationForm } from "./message/JobCreationForm";

interface ChatMessageProps {
  message: {
    content: string;
    role: "assistant" | "user";
    type?: "job_creation" | "text";
    step?: "title" | "description" | "budget" | "location" | "category" | "confirm";
  };
  onResponse?: (response: string) => void;
}

export function ChatMessage({ message, onResponse }: ChatMessageProps) {
  return (
    <div className="space-y-2">
      <MessageBubble content={message.content} role={message.role} />
      {message.type === "job_creation" && onResponse && message.step && (
        <JobCreationForm 
          step={message.step} 
          onResponse={onResponse}
        />
      )}
    </div>
  );
}