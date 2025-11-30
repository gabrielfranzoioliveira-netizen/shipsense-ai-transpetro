import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { vessels } from '@/data/vessels';

const fuelConsumptionData = [
  { month: 'Jan', consumo: 1250, otimizado: 1050 },
  { month: 'Fev', consumo: 1380, otimizado: 1120 },
  { month: 'Mar', consumo: 1420, otimizado: 1180 },
  { month: 'Abr', consumo: 1290, otimizado: 1090 },
  { month: 'Mai', consumo: 1450, otimizado: 1210 },
  { month: 'Jun', consumo: 1520, otimizado: 1280 },
  { month: 'Jul', consumo: 1380, otimizado: 1150 },
  { month: 'Ago', consumo: 1290, otimizado: 1080 },
  { month: 'Set', consumo: 1410, otimizado: 1170 },
  { month: 'Out', consumo: 1350, otimizado: 1120 },
  { month: 'Nov', consumo: 1480, otimizado: 1230 },
  { month: 'Dez', consumo: 1320, otimizado: 1100 },
];

const bioScoreDistribution = [
  { range: '0-20%', count: vessels.filter(v => v.bioScore <= 20).length, color: '#10b981' },
  { range: '21-40%', count: vessels.filter(v => v.bioScore > 20 && v.bioScore <= 40).length, color: '#22c55e' },
  { range: '41-60%', count: vessels.filter(v => v.bioScore > 40 && v.bioScore <= 60).length, color: '#f59e0b' },
  { range: '61-80%', count: vessels.filter(v => v.bioScore > 60 && v.bioScore <= 80).length, color: '#f97316' },
  { range: '81-100%', count: vessels.filter(v => v.bioScore > 80).length, color: '#ef4444' },
];

const classData = [
  { name: 'Suezmax', vessels: vessels.filter(v => v.class === 'Suezmax').length },
  { name: 'Aframax', vessels: vessels.filter(v => v.class === 'Aframax').length },
  { name: 'MR 2', vessels: vessels.filter(v => v.class === 'MR 2').length },
  { name: 'Gaseiro 7k', vessels: vessels.filter(v => v.class === 'Gaseiro 7k').length },
];

const costProjection = [
  { month: 'Jan', semLimpeza: 850000, comLimpeza: 720000 },
  { month: 'Fev', semLimpeza: 920000, comLimpeza: 750000 },
  { month: 'Mar', semLimpeza: 1050000, comLimpeza: 780000 },
  { month: 'Abr', semLimpeza: 1180000, comLimpeza: 810000 },
  { month: 'Mai', semLimpeza: 1350000, comLimpeza: 850000 },
  { month: 'Jun', semLimpeza: 1520000, comLimpeza: 890000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString('pt-BR') : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function FuelConsumptionChart() {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Consumo de Combustível (ton/mês)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={fuelConsumptionData}>
          <defs>
            <linearGradient id="colorConsumo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorOtimizado" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="consumo" 
            stroke="#ef4444" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorConsumo)" 
            name="Consumo Atual"
          />
          <Area 
            type="monotone" 
            dataKey="otimizado" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorOtimizado)" 
            name="Consumo Otimizado"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-muted-foreground">Sem limpeza preventiva</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">Com limpeza otimizada</span>
        </div>
      </div>
    </div>
  );
}

export function BioScoreDistributionChart() {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Distribuição Bio Score</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={bioScoreDistribution} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis dataKey="range" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={60} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" name="Embarcações" radius={[0, 4, 4, 0]}>
            {bioScoreDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FleetCompositionChart() {
  const COLORS = ['#10b981', '#22c55e', '#3b82f6', '#8b5cf6'];
  
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Composição da Frota</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={classData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="vessels"
            nameKey="name"
          >
            {classData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
        {classData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
            <span className="text-xs text-muted-foreground">{entry.name} ({entry.vessels})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CostProjectionChart() {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Projeção de Custos (USD)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={costProjection}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v/1000)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="semLimpeza" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Sem Limpeza Preventiva"
          />
          <Line 
            type="monotone" 
            dataKey="comLimpeza" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Com Limpeza Otimizada"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
        <p className="text-sm text-emerald-500 font-medium">
          Economia potencial: $630,000 em 6 meses
        </p>
      </div>
    </div>
  );
}
