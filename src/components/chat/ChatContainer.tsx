
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface ChatContainerProps {
  children: ReactNode;
}

export function ChatContainer({ children }: ChatContainerProps) {
  return (
    <Card className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {children}
    </Card>
  );
}
