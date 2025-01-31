import { Hours } from "@/types/salary";

export const calculateDailyTotals = (hours: Hours) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dailyTotals: { [key: string]: number } = {};

  days.forEach(day => {
    dailyTotals[day] = (hours.regular[day] || 0) + 
                       (hours.doubleTime[day] || 0) + 
                       (hours.travelTime[day] || 0);
  });

  return dailyTotals;
};