import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  unread: boolean;
}

const mockMessages: Message[] = [
  {
    id: 1,
    sender: "Sophie Martin",
    content: "Bonjour, j'ai regardé votre profil...",
    time: "10:30",
    unread: true,
  },
  {
    id: 2,
    sender: "Tech Solutions",
    content: "Nous avons une opportunité...",
    time: "Hier",
    unread: false,
  },
];

export function Messages() {
  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center gap-2 text-victaure-blue">
        <MessageSquare className="h-5 w-5 animate-pulse" />
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                message.unread 
                  ? "bg-victaure-blue/10 border-l-2 border-victaure-blue" 
                  : "bg-victaure-dark/30 hover:bg-victaure-dark/40"
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{message.sender}</h3>
                <span className="text-xs text-victaure-gray">{message.time}</span>
              </div>
              <p className="text-sm text-victaure-gray mt-1 truncate">
                {message.content}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}