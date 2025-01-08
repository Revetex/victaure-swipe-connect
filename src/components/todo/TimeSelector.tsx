import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TimeSelectorProps {
  value?: string;
  onChange: (time: string) => void;
}

export function TimeSelector({ value, onChange }: TimeSelectorProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ['00', '15', '30', '45'];

  const timeSlots = hours.flatMap(hour => 
    minutes.map(minute => `${hour.toString().padStart(2, '0')}:${minute}`)
  );

  return (
    <ScrollArea className="h-72 rounded-md border">
      <div className="p-2">
        {timeSlots.map((time) => (
          <Button
            key={time}
            variant="ghost"
            className={cn(
              "w-full justify-start font-normal",
              value === time && "bg-primary/10 text-primary"
            )}
            onClick={() => onChange(time)}
          >
            {time}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}