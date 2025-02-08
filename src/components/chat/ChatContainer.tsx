
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface ChatContainerProps {
  children: ReactNode;
}

export function ChatContainer({ children }: ChatContainerProps) {
  return (
    <Card className="flex flex-col h-[calc(100vh-10rem)] mx-auto max-w-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-24">
      {children}
    </Card>
  );
}
