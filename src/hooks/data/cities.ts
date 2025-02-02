import { provinceData } from "./provinces";

export const cities = Object.values(provinceData).flat();

export const getCitiesForProvince = (province: keyof typeof provinceData) => {
  return provinceData[province] || [];
};