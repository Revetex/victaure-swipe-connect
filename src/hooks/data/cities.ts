import { provinceData } from "./provinces";

export const getCitiesForProvince = (province: keyof typeof provinceData): string[] => {
  return [...(provinceData[province] || [])];
};