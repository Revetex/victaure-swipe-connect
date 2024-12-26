import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Nouvelle mission",
    message: "Une nouvelle mission correspond à votre profil",
    time: "Il y a 5 min",
    read: false,
  },
  {
    id: 2,
    title: "Message reçu",
    message: "Vous avez reçu un nouveau message",
    time: "Il y a 1h",
    read: true,
  },
];

export function NotificationCenter() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-victaure-blue">
          <Bell className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <span className="text-xs bg-victaure-blue text-white px-2 py-1 rounded-full">
          {mockNotifications.filter(n => !n.read).length} nouvelles
        </span>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded ${
                notification.read
                  ? "bg-victaure-dark/30"
                  : "bg-victaure-blue/10 border-l-2 border-victaure-blue"
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{notification.title}</h3>
                <span className="text-xs text-victaure-gray">{notification.time}</span>
              </div>
              <p className="text-sm text-victaure-gray mt-1">{notification.message}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}