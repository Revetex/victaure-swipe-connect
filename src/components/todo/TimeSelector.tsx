
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TimeSelectorProps {
  selectedTime?: string;
  onTimeChange: (time: string) => void;
}

export function TimeSelector({ selectedTime, onTimeChange }: TimeSelectorProps) {
  const [inputValue, setInputValue] = useState(selectedTime || "");

  const formatTimeString = (value: string) => {
    // Remove non-numeric characters
    const numbers = value.replace(/[^\d]/g, "");
    
    if (numbers.length <= 2) {
      return numbers;
    }
    
    // Format as HH:MM
    let hours = parseInt(numbers.substring(0, 2));
    let minutes = parseInt(numbers.substring(2, 4));
    
    // Validate hours and minutes
    hours = Math.min(Math.max(hours, 0), 23);
    minutes = Math.min(Math.max(minutes || 0, 0), 59);
    
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const handleTimeChange = (value: string) => {
    setInputValue(value);
    const formattedTime = formatTimeString(value);
    if (formattedTime.length === 5) {
      onTimeChange(formattedTime);
    }
  };

  return (
    <div className="relative">
      <Input
        value={inputValue}
        onChange={(e) => handleTimeChange(e.target.value)}
        placeholder="HH:MM"
        className="w-[120px]"
      />
    </div>
  );
}
