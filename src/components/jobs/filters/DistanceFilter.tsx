import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { JobFilters } from "../JobFilterUtils";
import { useEffect, useState } from "react";

interface DistanceFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function DistanceFilter({ filters, onFilterChange }: DistanceFilterProps) {
  const [distance, setDistance] = useState<number>(filters.maxDistance || 50);

  useEffect(() => {
    // Get user's location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onFilterChange("userLatitude", position.coords.latitude);
          onFilterChange("userLongitude", position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  return (
    <div className="space-y-4">
      <Label>Distance maximale (km)</Label>
      <div className="space-y-2">
        <Slider
          value={[distance]}
          onValueChange={(value) => {
            setDistance(value[0]);
            onFilterChange("maxDistance", value[0]);
          }}
          max={100}
          step={5}
          className="w-full"
        />
        <div className="text-sm text-muted-foreground">
          {distance} km
        </div>
      </div>
    </div>
  );
}