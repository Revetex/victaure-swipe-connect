import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface QuickActionCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  gradient: string;
  isLoading?: boolean;
}

export function QuickActionCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor, 
  gradient,
  isLoading 
}: QuickActionCardProps) {
  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br ${gradient} hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`inline-flex items-center justify-center p-2 ${bgColor} rounded-lg`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {isLoading ? (
            <Skeleton className="h-8 w-24 mt-2" />
          ) : (
            <p className={`mt-2 text-2xl font-bold ${color}`}>
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}