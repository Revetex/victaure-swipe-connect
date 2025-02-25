
import { useProfileAccess } from '@/hooks/useProfileAccess';
import { Card } from '@/components/ui/card';
import {
  Briefcase,
  MessageSquare,
  DollarSign,
  Calendar,
  Users,
  FileText,
  Building,
  ChartBar
} from 'lucide-react';

export function DashboardStats() {
  const permissions = useProfileAccess();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {permissions.isBusinessProfile ? (
        // Stats pour les entreprises
        <>
          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Offres actives</h3>
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">12</p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Candidatures</h3>
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">48</p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Employés</h3>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">24</p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Performance</h3>
              <ChartBar className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">89%</p>
          </Card>
        </>
      ) : (
        // Stats pour les professionnels
        <>
          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Candidatures</h3>
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">8</p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Messages</h3>
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">15</p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Entretiens</h3>
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">3</p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Offres reçues</h3>
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">2</p>
          </Card>
        </>
      )}
    </div>
  );
}
