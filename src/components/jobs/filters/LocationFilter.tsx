import { useState } from "react";
import { provinces, cities, type Province } from "@/data/provinces";

interface LocationFilterProps {
  onLocationChange: (province: Province | null, city: string | null) => void;
}

export function LocationFilter({ onLocationChange }: LocationFilterProps) {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleProvinceChange = (province: Province) => {
    setSelectedProvince(province);
    setSelectedCity(null);
    onLocationChange(province, null);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    onLocationChange(selectedProvince, city);
  };

  return (
    <div>
      <div>
        <label>Province</label>
        <select
          value={selectedProvince || ""}
          onChange={(e) => handleProvinceChange(e.target.value as Province)}
        >
          <option value="" disabled>Select a province</option>
          {provinces.map((province) => (
            <option key={province} value={province}>{province}</option>
          ))}
        </select>
      </div>
      <div>
        <label>City</label>
        <select
          value={selectedCity || ""}
          onChange={(e) => handleCityChange(e.target.value)}
          disabled={!selectedProvince}
        >
          <option value="" disabled>Select a city</option>
          {selectedProvince && cities[selectedProvince].map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
