import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  selectedTime?: string;
  onTimeChange: (time: string) => void;
}

export function TimeSelector({ selectedTime, onTimeChange }: TimeSelectorProps) {
  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  return (
    <Select onValueChange={onTimeChange} value={selectedTime}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Heure">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {selectedTime || "Heure"}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}