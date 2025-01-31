import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Hours, Premiums } from "../../types/salary";

interface HoursFormProps {
  hours: Hours;
  premiums: Premiums;
  onHoursChange: (type: keyof Hours, day: string, value: string) => void;
  onPremiumChange: (type: keyof Premiums) => void;
  weekDates: Date[];
}

export function HoursForm({
  hours,
  premiums,
  onHoursChange,
  onPremiumChange,
  weekDates,
}: HoursFormProps) {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hours</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-8 gap-2">
          <div className="font-bold">Type</div>
          {days.map((day, index) => (
            <div key={day} className="font-bold capitalize">
              {weekDates[index]?.toLocaleDateString() || day}
            </div>
          ))}
        </div>

        {Object.entries(hours).map(([type, dayHours]) => (
          <div key={type} className="grid grid-cols-8 gap-2">
            <div className="capitalize">{type.replace(/([A-Z])/g, " $1").trim()}</div>
            {days.map((day) => (
              <Input
                key={`${type}-${day}`}
                type="number"
                min="0"
                step="0.5"
                value={dayHours[day]}
                onChange={(e) => onHoursChange(type as keyof Hours, day, e.target.value)}
                className="w-full"
              />
            ))}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Premiums</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(premiums).map(([premium, value]) => (
            <div key={premium} className="flex items-center space-x-2">
              <Checkbox
                id={premium}
                checked={value}
                onCheckedChange={() => onPremiumChange(premium as keyof Premiums)}
              />
              <Label htmlFor={premium} className="capitalize">
                {premium.replace(/([A-Z])/g, " $1").trim()}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}