import { vessels, calculateSavings } from '@/data/vessels';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function VesselTable() {
  const statusColors: Record<string, string> = {
    navegando: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    atracado: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    manutencao: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };

  const statusLabels: Record<string, string> = {
    navegando: 'Navegando',
    atracado: 'Atracado',
    manutencao: 'Manutenção',
  };

  const getBioScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-emerald-500';
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Embarcação</TableHead>
              <TableHead className="text-muted-foreground font-medium">Classe</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium text-center">Bio Score</TableHead>
              <TableHead className="text-muted-foreground font-medium">Consumo</TableHead>
              <TableHead className="text-muted-foreground font-medium">Última Limpeza</TableHead>
              <TableHead className="text-muted-foreground font-medium">Próxima Limpeza</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Economia Potencial</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vessels.map((vessel) => {
              const savings = calculateSavings(vessel.bioScore, vessel.fuelConsumption);
              return (
                <TableRow key={vessel.id} className="border-border/50 hover:bg-secondary/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{vessel.name}</p>
                      <p className="text-xs text-muted-foreground">{vessel.sigla}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{vessel.class}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("border", statusColors[vessel.status])}>
                      {statusLabels[vessel.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn("font-bold", getBioScoreColor(vessel.bioScore))}>
                        {vessel.bioScore}%
                      </span>
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            vessel.bioScore >= 70 ? "bg-red-500" :
                            vessel.bioScore >= 40 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${vessel.bioScore}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{vessel.fuelConsumption} ton/dia</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(vessel.lastCleaning).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {new Date(vessel.nextCleaning).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-emerald-500 font-medium">
                      ${savings.moneySaved.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mês
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
