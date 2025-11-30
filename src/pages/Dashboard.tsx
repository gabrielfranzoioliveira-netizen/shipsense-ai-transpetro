import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ship, Fuel, Leaf, AlertTriangle, DollarSign, Anchor, Map, Table2, BarChart } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { StatsCard } from '@/components/StatsCard';
import { VesselMap } from '@/components/VesselMap';
import { VesselTable } from '@/components/VesselTable';
import { FuelConsumptionChart, BioScoreDistributionChart, FleetCompositionChart, CostProjectionChart } from '@/components/DashboardCharts';
import { CleaningTips } from '@/components/CleaningTips';
import { MaintenanceScheduleTable } from '@/components/MaintenanceScheduleTable';
import { CostAnalysisTable } from '@/components/CostAnalysisTable';
import { Button } from '@/components/ui/button';
import { vessels } from '@/data/vessels';
import { cn } from '@/lib/utils';

type TabType = 'overview' | 'map' | 'fleet' | 'costs' | 'schedule';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const totalVessels = vessels.length;
  const navegando = vessels.filter(v => v.status === 'navegando').length;
  const alertVessels = vessels.filter(v => v.bioScore >= 70).length;
  const totalFuelConsumption = vessels.reduce((acc, v) => acc + v.fuelConsumption, 0);
  const totalCO2 = vessels.reduce((acc, v) => acc + v.co2Emissions, 0);
  const avgBioScore = Math.round(vessels.reduce((acc, v) => acc + v.bioScore, 0) / totalVessels);

  const tabs = [
    { id: 'overview' as TabType, label: 'Visão Geral', icon: BarChart },
    { id: 'map' as TabType, label: 'Mapa', icon: Map },
    { id: 'fleet' as TabType, label: 'Frota', icon: Table2 },
    { id: 'costs' as TabType, label: 'Custos', icon: DollarSign },
    { id: 'schedule' as TabType, label: 'Manutenções', icon: Anchor },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitoramento em tempo real da frota Transpetro
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'secondary'}
                onClick={() => setActiveTab(tab.id)}
                className="gap-2 shrink-0"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6"
          >
            <StatsCard
              title="Total de Navios"
              value={totalVessels}
              subtitle="Frota ativa"
              icon={Ship}
            />
            <StatsCard
              title="Em Navegação"
              value={navegando}
              subtitle={`${Math.round((navegando/totalVessels)*100)}% da frota`}
              icon={Anchor}
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title="Alertas Bio Score"
              value={alertVessels}
              subtitle="Acima de 70%"
              icon={AlertTriangle}
              className={alertVessels > 0 ? 'border-amber-500/30' : ''}
            />
            <StatsCard
              title="Consumo Total"
              value={`${totalFuelConsumption.toFixed(0)}`}
              subtitle="ton/dia"
              icon={Fuel}
            />
            <StatsCard
              title="Emissões CO₂"
              value={`${totalCO2.toFixed(0)}`}
              subtitle="ton/dia"
              icon={Leaf}
            />
            <StatsCard
              title="Bio Score Médio"
              value={`${avgBioScore}%`}
              subtitle="Da frota"
              icon={DollarSign}
              trend={{ value: 3, isPositive: false }}
            />
          </motion.div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FuelConsumptionChart />
                <CostProjectionChart />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BioScoreDistributionChart />
                <FleetCompositionChart />
              </div>
              <CleaningTips />
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-[600px]"
            >
              <VesselMap />
            </motion.div>
          )}

          {activeTab === 'fleet' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <VesselTable />
            </motion.div>
          )}

          {activeTab === 'costs' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CostAnalysisTable />
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MaintenanceScheduleTable />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
