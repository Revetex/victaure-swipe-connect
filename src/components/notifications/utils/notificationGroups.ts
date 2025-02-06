
import { isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";
import { Notification } from "@/types/notification";

export const groupNotifications = (notifications: Notification[]) => {
  return notifications.reduce((groups, notification) => {
    const date = new Date(notification.created_at);
    let groupKey = "";

    if (isToday(date)) {
      groupKey = "Aujourd'hui";
    } else if (isYesterday(date)) {
      groupKey = "Hier";
    } else if (isThisWeek(date)) {
      groupKey = "Cette semaine";
    } else if (isThisMonth(date)) {
      groupKey = "Ce mois";
    } else {
      groupKey = "Plus ancien";
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);
};
