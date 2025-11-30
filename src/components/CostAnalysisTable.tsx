import { vessels, fuelCostPerTon, calculateSavings } from '@/data/vessels';
import { DollarSign, TrendingUp, TrendingDown, Fuel, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CostAnalysisTable() {
  const vesselCosts = vessels
    .filter(v => v.fuelConsumption > 0)
    .map(vessel => {
      const savings = calculateSavings(vessel.bioScore, vessel.fuelConsumption);
      const monthlyFuelCost = vessel.fuelConsumption * 30 * fuelCostPerTon;
      const additionalCostFromBio = (vessel.bioScore / 100) * 0.15 * monthlyFuelCost;
      
      return {
        ...vessel,
        monthlyFuelCost,
        additionalCostFromBio,
        potentialSavings: savings.moneySaved,
        co2Reduction: savings.co2Reduced
      };
    })
    .sort((a, b) => b.potentialSavings - a.potentialSavings)
    .slice(0, 10);

  const totalMonthlyCost = vesselCosts.reduce((acc, v) => acc + v.monthlyFuelCost, 0);
  const totalAdditionalCost = vesselCosts.reduce((acc, v) => acc + v.additionalCostFromBio, 0);
  const totalPotentialSavings = vesselCosts.reduce((acc, v) => acc + v.potentialSavings, 0);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Análise de Custos por Embarcação
        </h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-secondary/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Fuel className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Custo Mensal Total</span>
          </div>
          <p className="text-xl font-bold">
            ${totalMonthlyCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-red-500" />
            <span className="text-xs text-muted-foreground">Custo Adicional (Bio)</span>
          </div>
          <p className="text-xl font-bold text-red-500">
            +${totalAdditionalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-muted-foreground">Economia Potencial</span>
          </div>
          <p className="text-xl font-bold text-emerald-500">
            ${totalPotentialSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Vessels Table */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
          <div className="col-span-3">Embarcação</div>
          <div className="col-span-2 text-center">Bio Score</div>
          <div className="col-span-2 text-right">Custo/Mês</div>
          <div className="col-span-2 text-right">Custo Bio</div>
          <div className="col-span-3 text-right">Economia Potencial</div>
        </div>
        
        {vesselCosts.map((vessel) => (
          <div
            key={vessel.id}
            className="grid grid-cols-12 gap-2 px-3 py-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors items-center"
          >
            <div className="col-span-3">
              <p className="font-medium text-sm truncate">{vessel.name}</p>
              <p className="text-xs text-muted-foreground">{vessel.class}</p>
            </div>
            <div className="col-span-2 text-center">
              <div className="inline-flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  vessel.bioScore >= 70 ? "bg-red-500" :
                  vessel.bioScore >= 40 ? "bg-amber-500" : "bg-emerald-500"
                )} />
                <span className={cn(
                  "font-semibold text-sm",
                  vessel.bioScore >= 70 ? "text-red-500" :
                  vessel.bioScore >= 40 ? "text-amber-500" : "text-emerald-500"
                )}>
                  {vessel.bioScore}%
                </span>
              </div>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-sm font-medium">
                ${vessel.monthlyFuelCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-sm text-red-500">
                +${vessel.additionalCostFromBio.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="col-span-3 text-right">
              <span className="text-sm font-semibold text-emerald-500">
                ${vessel.potentialSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <Leaf className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-muted-foreground">
                  -{vessel.co2Reduction.toFixed(0)}t CO₂
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
