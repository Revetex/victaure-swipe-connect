import { Hours, Premiums } from "@/types/salary";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock, DollarSign } from "lucide-react";
import { PremiumsForm } from "./PremiumsForm";
import { KeyboardEvent, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface HoursFormProps {
  hours: Hours;
  premiums: Premiums;
  onHoursChange: (type: keyof Hours, day: string, value: string) => void;
  onPremiumChange: (type: keyof Premiums) => void;
  weekDates?: Date[];
}

export const HoursForm = ({ hours, premiums, onHoursChange, onPremiumChange, weekDates }: HoursFormProps) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayNames = {
    sunday: 'D',
    monday: 'L',
    tuesday: 'M',
    wednesday: 'M',
    thursday: 'J',
    friday: 'V',
    saturday: 'S'
  };

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, type: keyof Hours, currentDay: string) => {
    const currentIndex = days.indexOf(currentDay);
    let nextIndex: number;
    let nextType: keyof Hours = type;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % days.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + days.length) % days.length;
        break;
      case 'ArrowUp':
        if (type === 'doubleTime') nextType = 'regular';
        else if (type === 'travelTime') nextType = 'doubleTime';
        nextIndex = currentIndex;
        break;
      case 'ArrowDown':
        if (type === 'regular') nextType = 'doubleTime';
        else if (type === 'doubleTime') nextType = 'travelTime';
        nextIndex = currentIndex;
        break;
      case 'Enter':
        if (type === 'regular') nextType = 'doubleTime';
        else if (type === 'doubleTime') nextType = 'travelTime';
        nextIndex = (currentIndex + 1) % days.length;
        break;
      default:
        return;
    }

    const nextInputId = `${nextType}-${days[nextIndex]}`;
    inputRefs.current[nextInputId]?.focus();
  };

  const handleHoursChange = (type: keyof Hours, day: string, value: string) => {
    if (type === 'regular' && (day === 'sunday' || day === 'saturday')) {
      toast({
        title: "Heures non permises",
        description: "Les heures régulières ne sont pas permises les samedis et dimanches",
        variant: "destructive",
      });
      return;
    }
    onHoursChange(type, day, value);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Heures</h2>
        </div>

        <Card className="p-1 sm:p-2">
          <div className="grid grid-cols-8 gap-0.5 bg-border rounded-md overflow-hidden">
            {/* Title Column */}
            <div className="bg-background">
              <div className="h-7 sm:h-[2.125rem] flex items-center justify-center bg-muted/30">
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Type</span>
              </div>
              <div className="space-y-0.5">
                <div className="h-6 sm:h-8 flex items-center px-1 sm:px-2 bg-background">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                    <span className="text-[10px] sm:text-xs">ST</span>
                  </div>
                </div>
                <div className="h-6 sm:h-8 flex items-center px-1 sm:px-2 bg-background">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <DollarSign className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                    <span className="text-[10px] sm:text-xs">DT</span>
                  </div>
                </div>
                <div className="h-6 sm:h-8 flex items-center px-1 sm:px-2 bg-background">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
                    <span className="text-[10px] sm:text-xs">TT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Days Columns */}
            {days.map((day, index) => {
              const isWeekend = day === 'sunday' || day === 'saturday';
              const date = weekDates?.[index];
              
              return (
                <div 
                  key={day}
                  className="bg-background"
                >
                  <div className="flex flex-col items-center justify-center bg-muted/30 py-0.5">
                    <Label 
                      className={`text-[10px] sm:text-xs font-medium ${
                        isWeekend ? 'text-red-500 dark:text-red-400' : 'text-muted-foreground'
                      }`}
                    >
                      {dayNames[day as keyof typeof dayNames]}
                    </Label>
                    {date && (
                      <span className="text-[8px] sm:text-[10px] text-muted-foreground">
                        {format(date, 'd MMM', { locale: fr })}
                      </span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    {/* Regular Hours */}
                    <div className="h-6 sm:h-8 flex items-center justify-center bg-background relative group">
                      <Input
                        id={`regular-${day}`}
                        ref={(el) => inputRefs.current[`regular-${day}`] = el}
                        type="number"
                        value={hours.regular[day as keyof typeof hours.regular] || ''}
                        onChange={(e) => handleHoursChange('regular', day, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'regular', day)}
                        className={`h-6 sm:h-7 w-full text-left p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-[10px] sm:text-xs ${
                          isWeekend ? 'bg-muted cursor-not-allowed' : ''
                        }`}
                        min="0"
                        max="24"
                        step="0.5"
                        disabled={isWeekend}
                      />
                    </div>

                    {/* Double Time Hours */}
                    <div className="h-6 sm:h-8 flex items-center justify-center bg-background relative group">
                      <Input
                        id={`doubleTime-${day}`}
                        ref={(el) => inputRefs.current[`doubleTime-${day}`] = el}
                        type="number"
                        value={hours.doubleTime[day as keyof typeof hours.doubleTime] || ''}
                        onChange={(e) => handleHoursChange('doubleTime', day, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'doubleTime', day)}
                        className="h-6 sm:h-7 w-full text-left p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-[10px] sm:text-xs"
                        min="0"
                        max="24"
                        step="0.5"
                      />
                    </div>

                    {/* Travel Time Hours */}
                    <div className="h-6 sm:h-8 flex items-center justify-center bg-background relative group">
                      <Input
                        id={`travelTime-${day}`}
                        ref={(el) => inputRefs.current[`travelTime-${day}`] = el}
                        type="number"
                        value={hours.travelTime[day as keyof typeof hours.travelTime] || ''}
                        onChange={(e) => handleHoursChange('travelTime', day, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'travelTime', day)}
                        className="h-6 sm:h-7 w-full text-left p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-[10px] sm:text-xs"
                        min="0"
                        max="24"
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <PremiumsForm premiums={premiums} onPremiumChange={onPremiumChange} />
    </div>
  );
};