import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  gradient: string;
  isEditing: boolean;
}

export function QuickActionCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor, 
  gradient,
  isEditing 
}: QuickActionCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ${isEditing ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
        <div className={`rounded-full ${bgColor} p-3`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
      <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${gradient}`} />
    </div>
  );
}