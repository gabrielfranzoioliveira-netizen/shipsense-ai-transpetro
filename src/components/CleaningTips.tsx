import { Lightbulb, AlertTriangle, CheckCircle, Clock, Shield, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

const tips = [
  {
    icon: Clock,
    title: 'Timing Ideal',
    description: 'Realize limpezas quando o Bio Score atinge 40-50%. Aguardar além de 60% aumenta o custo de limpeza em até 3x.',
    type: 'info'
  },
  {
    icon: Droplets,
    title: 'Limpeza Subaquática',
    description: 'Para cracas leves, escovação mecânica é suficiente. Cracas pesadas requerem jateamento de alta pressão.',
    type: 'tip'
  },
  {
    icon: AlertTriangle,
    title: 'Zonas Críticas',
    description: 'Priorize hélice e leme - áreas com maior impacto no consumo. 80% do ganho de eficiência vem dessas regiões.',
    type: 'warning'
  },
  {
    icon: Shield,
    title: 'Tintas Antincrustantes',
    description: 'Renovar a tinta antincrustante a cada 24-36 meses. Usar tintas de silicone em rotas de alta velocidade.',
    type: 'tip'
  },
  {
    icon: CheckCircle,
    title: 'Inspeção Regular',
    description: 'Realizar inspeções ROV a cada 3-4 meses em águas tropicais. Em águas frias, intervalo pode ser de 6 meses.',
    type: 'success'
  },
  {
    icon: Lightbulb,
    title: 'Prevenção de Cracas',
    description: 'Manter velocidade mínima de 10 nós durante navegação reduz significativamente a aderência de organismos.',
    type: 'info'
  }
];

const typeStyles = {
  info: 'border-blue-500/30 bg-blue-500/5',
  tip: 'border-emerald-500/30 bg-emerald-500/5',
  warning: 'border-amber-500/30 bg-amber-500/5',
  success: 'border-green-500/30 bg-green-500/5'
};

const iconStyles = {
  info: 'text-blue-500 bg-blue-500/10',
  tip: 'text-emerald-500 bg-emerald-500/10',
  warning: 'text-amber-500 bg-amber-500/10',
  success: 'text-green-500 bg-green-500/10'
};

export function CleaningTips() {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        Dicas de Limpeza e Manutenção
      </h3>
      <div className="grid gap-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border transition-all hover:shadow-md",
              typeStyles[tip.type as keyof typeof typeStyles]
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
              iconStyles[tip.type as keyof typeof iconStyles]
            )}>
              <tip.icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
