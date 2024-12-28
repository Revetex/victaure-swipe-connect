import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  unread: boolean;
  avatar?: string;
}

const mockMessages: Message[] = [
  {
    id: 1,
    sender: "Sophie Martin",
    content: "Bonjour, j'ai regardé votre profil et je pense que votre expérience correspondrait parfaitement à notre poste...",
    time: new Date().toISOString(),
    unread: true,
    avatar: "https://i.pravatar.cc/150?u=sophie",
  },
  {
    id: 2,
    sender: "Tech Solutions",
    content: "Nous avons une opportunité passionnante dans le développement web qui pourrait vous intéresser...",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
    avatar: "https://i.pravatar.cc/150?u=tech",
  },
];

export function Messages() {
  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <Badge variant="secondary" className="bg-primary/10">
          {mockMessages.filter(m => m.unread).length} nouveau{mockMessages.filter(m => m.unread).length > 1 ? 'x' : ''}
        </Badge>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <AnimatePresence>
          <div className="space-y-2">
            {mockMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  message.unread 
                    ? "bg-primary/10 border-l-2 border-primary shadow-sm" 
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={message.avatar} alt={message.sender} />
                    <AvatarFallback>{message.sender.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-medium truncate">{message.sender}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(message.time), { 
                          addSuffix: true,
                          locale: fr 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}