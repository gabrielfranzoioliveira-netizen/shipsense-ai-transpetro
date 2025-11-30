import { maintenanceSchedule, vessels } from '@/data/vessels';
import { Calendar, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const getStatusInfo = (date: string) => {
  const maintenanceDate = new Date(date);
  const today = new Date();
  const diffDays = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { status: 'completed', label: 'Concluída', color: 'success', icon: CheckCircle };
  } else if (diffDays <= 30) {
    return { status: 'urgent', label: 'Urgente', color: 'danger', icon: AlertTriangle };
  } else if (diffDays <= 90) {
    return { status: 'soon', label: 'Em breve', color: 'warning', icon: Calendar };
  } else {
    return { status: 'scheduled', label: 'Agendada', color: 'secondary', icon: Wrench };
  }
};

export function MaintenanceScheduleTable() {
  // Get future maintenances sorted by date
  const sortedSchedule = [...maintenanceSchedule]
    .map(item => ({
      ...item,
      dateObj: new Date(item.date),
      vesselData: vessels.find(v => v.name.toLowerCase() === item.vessel.toLowerCase())
    }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
    .slice(0, 15);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Cronograma de Manutenções
        </h3>
        <Badge variant="outline" className="text-xs">
          {maintenanceSchedule.length} docagens
        </Badge>
      </div>
      
      <div className="space-y-3">
        {sortedSchedule.map((item, index) => {
          const statusInfo = getStatusInfo(item.date);
          const IconComponent = statusInfo.icon;
          
          return (
            <div
              key={`${item.vessel}-${item.date}-${index}`}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all hover:bg-secondary/50",
                statusInfo.status === 'urgent' && "border-red-500/30 bg-red-500/5",
                statusInfo.status === 'soon' && "border-amber-500/30 bg-amber-500/5",
                statusInfo.status === 'completed' && "border-emerald-500/30 bg-emerald-500/5",
                statusInfo.status === 'scheduled' && "border-border"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  statusInfo.status === 'urgent' && "bg-red-500/10",
                  statusInfo.status === 'soon' && "bg-amber-500/10",
                  statusInfo.status === 'completed' && "bg-emerald-500/10",
                  statusInfo.status === 'scheduled' && "bg-secondary"
                )}>
                  <IconComponent className={cn(
                    "h-5 w-5",
                    statusInfo.status === 'urgent' && "text-red-500",
                    statusInfo.status === 'soon' && "text-amber-500",
                    statusInfo.status === 'completed' && "text-emerald-500",
                    statusInfo.status === 'scheduled' && "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.vessel}</p>
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Date(item.date).toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                  <Badge variant={statusInfo.color as any} className="text-xs">
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
