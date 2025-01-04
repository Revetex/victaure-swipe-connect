import { TabsContent } from "@/components/ui/tabs";

interface MessagesContentProps {
  children: React.ReactNode;
}

export function MessagesContent({ children }: MessagesContentProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <TabsContent value="assistant" className="h-full m-0 outline-none">
        {children}
      </TabsContent>
    </div>
  );
}