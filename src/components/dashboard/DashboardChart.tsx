import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { motion } from "framer-motion";

interface ActivityData {
  date: string;
  matches: number;
  messages: number;
}

export function DashboardChart() {
  const { theme } = useTheme();
  
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['activityData'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Use Promise.all to fetch data concurrently
      const [{ data: matchesData, error: matchesError }, { data: messagesData, error: messagesError }] = await Promise.all([
        supabase
          .from('matches')
          .select('created_at')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at'),
        supabase
          .from('messages')
          .select('created_at')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at')
      ]);

      if (matchesError) throw matchesError;
      if (messagesError) throw messagesError;

      const activityByDay = new Map<string, { matches: number; messages: number }>();
      
      matchesData?.forEach(match => {
        const date = new Date(match.created_at).toLocaleDateString();
        const current = activityByDay.get(date) || { matches: 0, messages: 0 };
        activityByDay.set(date, { ...current, matches: current.matches + 1 });
      });

      messagesData?.forEach(message => {
        const date = new Date(message.created_at).toLocaleDateString();
        const current = activityByDay.get(date) || { matches: 0, messages: 0 };
        activityByDay.set(date, { ...current, messages: current.messages + 1 });
      });

      return Array.from(activityByDay.entries()).map(([date, data]): ActivityData => ({
        date,
        matches: data.matches,
        messages: data.messages
      }));
    }
  });

  const chartTheme = useMemo(() => ({
    gridColor: theme === 'dark' ? '#374151' : '#E5E7EB',
    textColor: theme === 'dark' ? '#9CA3AF' : '#6B7280',
    tooltipBg: theme === 'dark' ? '#1F2937' : '#FFFFFF',
    lineColors: {
      matches: '#3B82F6',
      messages: '#10B981'
    }
  }), [theme]);

  if (isLoading) {
    return (
      <Card className="p-6 h-[400px] animate-pulse">
        <div className="h-full bg-muted/50 rounded-lg" />
      </Card>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[400px]"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Activité des 30 derniers jours
      </h3>
      <div className="h-full bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
            <XAxis 
              dataKey="date" 
              stroke={chartTheme.textColor}
              tick={{ fill: chartTheme.textColor }}
            />
            <YAxis 
              stroke={chartTheme.textColor}
              tick={{ fill: chartTheme.textColor }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: chartTheme.tooltipBg,
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="matches" 
              stroke={chartTheme.lineColors.matches}
              name="Matches"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: chartTheme.lineColors.matches }}
            />
            <Line 
              type="monotone" 
              dataKey="messages" 
              stroke={chartTheme.lineColors.messages}
              name="Messages"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: chartTheme.lineColors.messages }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}