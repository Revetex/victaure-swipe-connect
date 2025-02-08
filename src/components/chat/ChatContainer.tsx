
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function ChatContainer({ children }: { children: ReactNode }) {
  return (
    <Card className="fixed inset-0 z-[99999] bg-background/95 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        {children}
      </div>
    </Card>
  );
}
