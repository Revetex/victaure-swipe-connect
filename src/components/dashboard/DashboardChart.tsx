import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function DashboardChart() {
  const { theme } = useTheme();
  
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['activityData'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: matches } = await supabase
        .from('matches')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at');

      const { data: messages } = await supabase
        .from('messages')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at');

      // Group by day
      const activityByDay = new Map();
      
      matches?.forEach(match => {
        const date = new Date(match.created_at).toLocaleDateString();
        activityByDay.set(date, {
          ...activityByDay.get(date),
          matches: (activityByDay.get(date)?.matches || 0) + 1
        });
      });

      messages?.forEach(message => {
        const date = new Date(message.created_at).toLocaleDateString();
        activityByDay.set(date, {
          ...activityByDay.get(date),
          messages: (activityByDay.get(date)?.messages || 0) + 1
        });
      });

      return Array.from(activityByDay.entries()).map(([date, data]) => ({
        date,
        matches: data.matches || 0,
        messages: data.messages || 0
      }));
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6 h-[400px] animate-pulse">
        <div className="h-full bg-muted/50 rounded-lg"></div>
      </Card>
    );
  }

  return (
    <div className="h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Activité des 30 derniers jours</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
          <XAxis 
            dataKey="date" 
            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
          />
          <YAxis 
            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
              border: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="matches" 
            stroke="#3B82F6" 
            name="Matches"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="messages" 
            stroke="#10B981" 
            name="Messages"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}