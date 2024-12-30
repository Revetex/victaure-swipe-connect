import type { Tables } from "./database";

export type Notification = Tables<'notifications'>;

export interface NotificationDisplay extends Notification {
  formattedDate?: string;
}