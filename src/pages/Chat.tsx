import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { vessels, cleaningReports, maintenanceSchedule } from '@/data/vessels';
import {
  fleetInfo,
  dataDictionary,
  beaufortScale,
  seaConditions,
  foulingTypes,
  normanRating,
  cleaningProcedures,
  safetyProcedures,
  fuelConsumptionImpact,
  economicImpact,
  iwsReports,
  dockingSchedule,
  paintApplications,
  biofoulingInfo,
  hackathonObjective,
  ports
} from '@/data/knowledgeBase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  'Qual o status atual da frota?',
  'Quais navios precisam de limpeza urgente?',
  'O que é bioincrustação?',
  'Quais EPIs usar para limpeza de casco?',
  'Qual o impacto no consumo de combustível?',
  'Explique a escala Beaufort',
  'Como funciona a escala NORMAN?',
  'Quanto custa uma docagem?',
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o assistente ShipSense AI, treinado com dados reais da Petrobras/Transpetro. Posso responder sobre:\n\n• **Frota**: 21 embarcações (dados técnicos, localização, status)\n• **Bioincrustação**: causas, impactos, prevenção\n• **Procedimentos**: limpeza, docagem, segurança, EPIs\n• **Dados técnicos**: escalas Beaufort/NORMAN, tipos de combustível\n• **Custos**: consumo, economia com limpeza, docagem\n• **Relatórios IWS**: histórico de inspeções\n\nComo posso ajudar?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Status da frota
    if ((q.includes('status') || q.includes('situacao')) && (q.includes('frota') || q.includes('navios') || q.includes('embarcacoes'))) {
      const navegando = vessels.filter(v => v.status === 'navegando').length;
      const atracado = vessels.filter(v => v.status === 'atracado').length;
      const manutencao = vessels.filter(v => v.status === 'manutencao').length;
      const avgBioScore = Math.round(vessels.reduce((acc, v) => acc + v.bioScore, 0) / vessels.length);
      
      return `📊 **Status Atual da Frota Transpetro:**\n\n` +
        `**Composição:**\n` +
        `• **${vessels.length}** embarcações totais\n` +
        `• ${fleetInfo.classes.suezmax.count} Suezmax | ${fleetInfo.classes.aframax.count} Aframax | ${fleetInfo.classes.mr2.count} MR2 | ${fleetInfo.classes.gaseiro7k.count} Gaseiros\n\n` +
        `**Status Operacional:**\n` +
        `• 🟢 **${navegando}** em navegação\n` +
        `• 🟡 **${atracado}** atracadas\n` +
        `• 🔴 **${manutencao}** em manutenção\n\n` +
        `**Indicadores:**\n` +
        `• Bio Score médio: **${avgBioScore}%**\n` +
        `• Taxa de operação: **${Math.round((navegando/vessels.length)*100)}%**\n\n` +
        `A frota transporta principalmente petróleo (${fleetInfo.classes.suezmax.count + fleetInfo.classes.aframax.count + fleetInfo.classes.mr2.count} navios) e GLP (${fleetInfo.classes.gaseiro7k.count} gaseiros).`;
    }

    // Limpeza urgente
    if (q.includes('limpeza') && (q.includes('urgente') || q.includes('precisam') || q.includes('critico'))) {
      const urgentVessels = vessels.filter(v => v.bioScore >= 60).sort((a, b) => b.bioScore - a.bioScore);
      if (urgentVessels.length === 0) {
        return '✅ **Excelente!** Nenhuma embarcação requer limpeza urgente no momento.\n\nTodas as embarcações estão com Bio Score abaixo de 60%, indicando níveis aceitáveis de bioincrustação.';
      }
      let response = `⚠️ **Embarcações que Requerem Atenção:**\n\n`;
      urgentVessels.forEach(v => {
        const urgency = v.bioScore >= 80 ? '🔴 CRÍTICO' : '🟠 URGENTE';
        const extraCost = Math.round((v.bioScore / 100) * 0.15 * v.fuelConsumption * 30 * economicImpact.fuelCostPerTon);
        response += `**${v.name}** (${v.sigla})\n` +
          `• Bio Score: ${v.bioScore}% ${urgency}\n` +
          `• Classe: ${v.class}\n` +
          `• Custo extra estimado/mês: **$${extraCost.toLocaleString()}**\n\n`;
      });
      response += `\n💡 **Recomendação:** Agendar limpeza imediata para evitar aumento no consumo de combustível e emissões.`;
      return response;
    }

    // Bioincrustação
    if (q.includes('bioincrustacao') || q.includes('fouling') || q.includes('incrustacao') || q.includes('o que e bio')) {
      return `🦠 **Bioincrustação (Biofouling)**\n\n` +
        `**Definição:**\n${biofoulingInfo.definition}\n\n` +
        `**Causas Principais:**\n${biofoulingInfo.causes.map(c => `• ${c}`).join('\n')}\n\n` +
        `**Impactos Operacionais:**\n${biofoulingInfo.impacts.map(i => `• ${i}`).join('\n')}\n\n` +
        `**Prevenção:**\n${biofoulingInfo.prevention.map(p => `• ${p}`).join('\n')}\n\n` +
        `📈 Um navio com 70% de Bio Score pode consumir até **12% mais combustível** que um navio limpo.`;
    }

    // Tipos de incrustação
    if (q.includes('tipo') && (q.includes('incrustacao') || q.includes('fouling'))) {
      return `🔬 **Tipos de Incrustação Marítima:**\n\n` +
        Object.entries(foulingTypes).map(([key, desc]) => `**${key.charAt(0).toUpperCase() + key.slice(1)}:**\n${desc}`).join('\n\n') +
        `\n\n**Classificação por Dureza:**\n` +
        `• **Moles** (algas, limo): Fácil remoção, impacto moderado\n` +
        `• **Duras** (cracas, calcárea): Difícil remoção, alto impacto\n\n` +
        `As incrustações duras são mais problemáticas pois requerem limpeza mecânica e podem danificar a pintura anti-incrustante.`;
    }

    // Escala Beaufort
    if (q.includes('beaufort') || (q.includes('escala') && q.includes('vento'))) {
      let response = `🌬️ **Escala Beaufort (Intensidade do Vento):**\n\n`;
      Object.entries(beaufortScale).forEach(([level, data]) => {
        response += `**${level}** - ${data.desc}\n` +
          `  Vento: ${data.wind} | Mar: ${data.seaState}\n`;
      });
      response += `\n⚠️ Operações de limpeza subaquática devem ser realizadas com Beaufort < 4 para garantir segurança.`;
      return response;
    }

    // Escala NORMAN
    if (q.includes('norman') || (q.includes('escala') && q.includes('incrustacao'))) {
      let response = `📋 **Escala NORMAN 401 (Nível de Incrustação):**\n\n`;
      Object.entries(normanRating).forEach(([level, desc]) => {
        response += `**Nível ${level}:** ${desc}\n`;
      });
      response += `\n📝 Esta escala é utilizada nos relatórios IWS para padronizar a avaliação de bioincrustação nas embarcações.`;
      return response;
    }

    // Condições do mar
    if (q.includes('condicoes do mar') || q.includes('sea condition')) {
      let response = `🌊 **Condições do Mar (Sea Conditions):**\n\n`;
      Object.entries(seaConditions).forEach(([level, desc]) => {
        response += `**${level}:** ${desc}\n`;
      });
      return response;
    }

    // EPIs e Segurança
    if (q.includes('epi') || q.includes('seguranca') || q.includes('equipamento') || q.includes('protecao')) {
      return `🛡️ **Equipamentos de Proteção Individual (EPIs):**\n\n` +
        `**EPIs Obrigatórios para Mergulho:**\n${safetyProcedures.epis.map(e => `• ${e}`).join('\n')}\n\n` +
        `**Checklist Pré-Operação:**\n${safetyProcedures.preOperationChecklist.map(c => `• ${c}`).join('\n')}\n\n` +
        `**Procedimentos de Emergência:**\n${safetyProcedures.emergencyProcedures.map(e => `• ${e}`).join('\n')}\n\n` +
        `⚠️ Todo mergulho deve ser realizado por equipe certificada IMCA com embarcação de apoio disponível.`;
    }

    // Consumo de combustível / Economia
    if (q.includes('consumo') || q.includes('combustivel') || q.includes('economia') || q.includes('economizar') || q.includes('impacto')) {
      return `⛽ **Impacto da Bioincrustação no Consumo:**\n\n` +
        `**Por Nível de Bio Score:**\n` +
        Object.entries(fuelConsumptionImpact).map(([key, data]) => 
          `• **${key.replace('bioScore', '')}%:** +${data.consumptionIncrease} (${data.description})`
        ).join('\n') +
        `\n\n**Consumo Médio Diário por Classe:**\n` +
        `• Suezmax: ${economicImpact.avgDailyConsumption.suezmax} ton/dia\n` +
        `• Aframax: ${economicImpact.avgDailyConsumption.aframax} ton/dia\n` +
        `• MR2: ${economicImpact.avgDailyConsumption.mr2} ton/dia\n` +
        `• Gaseiro 7k: ${economicImpact.avgDailyConsumption.gaseiro7k} ton/dia\n\n` +
        `**Custos de Referência:**\n` +
        `• Combustível: **$${economicImpact.fuelCostPerTon}/ton**\n` +
        `• Taxa CO₂: **$${economicImpact.co2CostPerTon}/ton**\n\n` +
        `💡 **Exemplo:** Um Suezmax com 70% de Bio Score consome ~6 ton/dia extras, custando **~$117.000/mês** a mais.`;
    }

    // Custos de limpeza/docagem
    if (q.includes('custo') || q.includes('preco') || q.includes('quanto custa') || q.includes('valor')) {
      return `💰 **Custos de Manutenção:**\n\n` +
        `**Limpeza Subaquática:**\n` +
        `• Faixa: $${economicImpact.cleaningCosts.underwater.min.toLocaleString()} - $${economicImpact.cleaningCosts.underwater.max.toLocaleString()}\n` +
        `• Duração: 1-3 dias\n` +
        `• Frequência ideal: a cada 3-4 meses\n\n` +
        `**Docagem Especial:**\n` +
        `• Faixa: $${economicImpact.cleaningCosts.docking.min.toLocaleString()} - $${economicImpact.cleaningCosts.docking.max.toLocaleString()}\n` +
        `• Duração: 2-4 semanas\n` +
        `• Intervalo máximo: 60 meses\n\n` +
        `**Combustível:**\n` +
        `• LSHFO 0.5: ~$${economicImpact.fuelCostPerTon}/ton\n` +
        `• ULSMGO 0.1: ~$${economicImpact.fuelCostPerTon + 150}/ton\n\n` +
        `📊 **ROI da Limpeza Preventiva:** Uma limpeza de $30.000 pode economizar >$100.000/mês em combustível para navios com alto Bio Score.`;
    }

    // Procedimentos de limpeza
    if (q.includes('procedimento') && q.includes('limpeza')) {
      return `🧹 **Procedimentos de Limpeza:**\n\n` +
        Object.values(cleaningProcedures).map(proc => 
          `**${proc.title}**\n` +
          `• ${proc.description}\n` +
          `• Frequência: ${proc.frequency}\n` +
          `• Método: ${proc.method}\n` +
          `• Benefício: ${proc.benefits}`
        ).join('\n\n') +
        `\n\n📝 Todas as limpezas devem ser documentadas em relatório IWS com fotos/vídeo.`;
    }

    // Docagem
    if (q.includes('docagem') || q.includes('dique seco')) {
      const futureDockins = dockingSchedule.filter(d => d.type.includes('Próxima'));
      return `🔧 **Docagem de Embarcações:**\n\n` +
        `**O que é:**\nManutenção completa em dique seco, onde todo o casco é limpo e a tinta anti-incrustante é reaplicada.\n\n` +
        `**Intervalo Máximo:** 60 meses entre docagens (regulamentação IMO)\n\n` +
        `**Próximas Docagens Programadas:**\n` +
        futureDockins.map(d => `• **${d.vessel}:** ${new Date(d.date).toLocaleDateString('pt-BR')}`).join('\n') +
        `\n\n**Atividades Realizadas:**\n` +
        `• Jateamento e limpeza completa do casco\n` +
        `• Inspeção estrutural\n` +
        `• Repintura com tinta anti-incrustante\n` +
        `• Manutenção de hélice e leme\n` +
        `• Verificação de válvulas de fundo`;
    }

    // Relatórios IWS
    if (q.includes('iws') || q.includes('relatorio') || q.includes('inspecao')) {
      const recentReports = iwsReports.slice(0, 5);
      return `📋 **Relatórios IWS (Inspeção de Casco):**\n\n` +
        `**Últimas Inspeções:**\n` +
        recentReports.map(r => 
          `**${r.vessel}** (${r.sigla}) - ${new Date(r.date).toLocaleDateString('pt-BR')}\n` +
          `  Local: ${r.location}\n` +
          `  Condição: ${r.condition} | Incrustação: ${r.foulingType}\n` +
          `  Fundo: ${r.flatBottom} | Costado: ${r.side} | Hélice: ${r.propeller}`
        ).join('\n\n') +
        `\n\n📊 Total de ${iwsReports.length} relatórios IWS disponíveis no sistema.`;
    }

    // Tintas/Pinturas
    if (q.includes('tinta') || q.includes('pintura') || q.includes('antincrustante') || q.includes('anti-fouling')) {
      return `🎨 **Tintas Anti-Incrustantes:**\n\n` +
        `**Tipos Utilizados:**\n` +
        `• **CDP (Controlled Depletion Polymer):** Libera biocida gradualmente\n` +
        `• **SPC (Self-Polishing Copolymer):** Auto-polimento, mais eficiente\n\n` +
        `**Período de Verificação:**\n` +
        `• Típico: 28-52 dias\n` +
        `• Estendido: 90-150 dias (tintas premium)\n\n` +
        `**Aplicações Recentes:**\n` +
        paintApplications.slice(0, 5).map(p => 
          `• **${p.vessel}:** ${new Date(p.applicationDate).toLocaleDateString('pt-BR')} (Período: ${p.verificationPeriod} dias)`
        ).join('\n') +
        `\n\n⚠️ A eficácia da tinta diminui com o tempo e longos períodos parado em águas quentes.`;
    }

    // Portos
    if (q.includes('porto') || q.includes('terminal') || q.includes('localizacao')) {
      return `🏭 **Portos e Terminais:**\n\n` +
        `**Brasil:**\n` +
        ports.brazil.map(p => `• ${p.name}`).join('\n') +
        `\n\n**Internacionais:**\n` +
        ports.international.map(p => `• ${p.name}`).join('\n') +
        `\n\n📍 Os portos brasileiros concentram a maioria das operações de limpeza subaquática da frota.`;
    }

    // Hackathon
    if (q.includes('hackathon') || q.includes('objetivo') || q.includes('projeto')) {
      return `🎯 **Objetivo do Hackathon Transpetro:**\n\n${hackathonObjective}\n\n` +
        `**Dados Disponíveis:**\n` +
        `• ResultadoQueryEventos.csv - ${(50905).toLocaleString()} registros de navegação\n` +
        `• ResultadoQueryConsumo.csv - ${(87738).toLocaleString()} registros de consumo\n` +
        `• Relatórios IWS - Histórico de inspeções\n` +
        `• Dados dos Navios - Especificações técnicas\n` +
        `• Dicionário de Dados - Descrição de campos`;
    }

    // Dicionário de dados
    if (q.includes('dicionario') || q.includes('significado') || q.includes('campo') || q.includes('variavel')) {
      const entries = Object.entries(dataDictionary).slice(0, 10);
      return `📖 **Dicionário de Dados:**\n\n` +
        entries.map(([key, desc]) => `**${key}:** ${desc}`).join('\n\n') +
        `\n\n📝 Existem ${Object.keys(dataDictionary).length} campos documentados. Pergunte sobre um campo específico para mais detalhes.`;
    }

    // Classes de navios
    if (q.includes('classe') || q.includes('suezmax') || q.includes('aframax') || q.includes('mr2') || q.includes('gaseiro')) {
      return `🚢 **Classes de Embarcações da Frota:**\n\n` +
        `**Suezmax (${fleetInfo.classes.suezmax.count} navios)**\n` +
        `• Tipo: Petroleiro\n` +
        `• Porte médio: ~${fleetInfo.classes.suezmax.avgDeadweight.toLocaleString()} ton\n` +
        `• Dimensões: 274m x 48m x 17m (calado)\n` +
        `• Navios: Rafael Santos, Henrique Alves, Victor Oliveira, Felipe Ribeiro, Giselle Carvalho, Raul Martins, Paulo Moura, Marcos Cavalcanti\n\n` +
        `**Aframax (${fleetInfo.classes.aframax.count} navios)**\n` +
        `• Tipo: Petroleiro\n` +
        `• Porte médio: ~${fleetInfo.classes.aframax.avgDeadweight.toLocaleString()} ton\n` +
        `• Dimensões: 249m x 43.8m x 15m (calado)\n` +
        `• Navios: Daniel Pereira, Carla Silva, Renato Gomes, Gabriela Martins, Rodrigo Pinheiro\n\n` +
        `**MR 2 (${fleetInfo.classes.mr2.count} navios)**\n` +
        `• Tipo: Petroleiro (Product Carrier)\n` +
        `• Porte médio: ~${fleetInfo.classes.mr2.avgDeadweight.toLocaleString()} ton\n` +
        `• Dimensões: 182.85m x 32.2m x 12.8m (calado)\n` +
        `• Navios: Eduardo Costa, Thiago Fernandes, Romario Silva, Lucas Mendonça\n\n` +
        `**Gaseiro 7k (${fleetInfo.classes.gaseiro7k.count} navios)**\n` +
        `• Tipo: Gaseiro (LPG Carrier)\n` +
        `• Porte médio: ~${fleetInfo.classes.gaseiro7k.avgDeadweight.toLocaleString()} ton\n` +
        `• Dimensões: 117.63m x 19.2m x 5.8m (calado)\n` +
        `• Navios: Ricardo Barbosa, Bruno Lima, Fábio Santos, Maria Valentina`;
    }

    // Combustíveis
    if (q.includes('combustivel') || q.includes('lshfo') || q.includes('ulsmgo') || q.includes('tipo de combustivel')) {
      return `⛽ **Tipos de Combustível Marítimo:**\n\n` +
        `**LSHFO 0.5 (Low Sulphur Heavy Fuel Oil)**\n` +
        `• Teor de enxofre: máx. 0.5%\n` +
        `• Uso: Motor de combustão principal (MCP)\n` +
        `• Custo: ~$${economicImpact.fuelCostPerTon}/ton\n` +
        `• Padrão IMO 2020\n\n` +
        `**ULSMGO 0.1 (Ultra Low Sulphur Marine Gas Oil)**\n` +
        `• Teor de enxofre: máx. 0.1%\n` +
        `• Uso: Áreas de emissão controlada (ECA)\n` +
        `• Custo: ~$${economicImpact.fuelCostPerTon + 150}/ton\n` +
        `• Mais limpo, menos poluente\n\n` +
        `📊 A frota utiliza predominantemente LSHFO 0.5 para navegação oceânica.`;
    }

    // Hélice
    if (q.includes('helice') || q.includes('propulsor') || q.includes('propeller')) {
      return `⚙️ **Manutenção do Hélice:**\n\n` +
        `**Importância:**\n` +
        `O hélice é responsável por ~80% da eficiência propulsiva. Incrustação no hélice causa:\n` +
        `• Perda de empuxo\n` +
        `• Vibração excessiva\n` +
        `• Aumento de consumo\n` +
        `• Desgaste do eixo\n\n` +
        `**Frequência de Limpeza:**\n` +
        `• Preventiva: a cada 2-3 meses\n` +
        `• Polimento: anual ou na docagem\n\n` +
        `**Status Atual da Frota (Hélice):**\n` +
        iwsReports.slice(0, 5).map(r => `• ${r.vessel}: ${r.propeller}`).join('\n') +
        `\n\n💡 Priorize sempre a limpeza do hélice - melhor ROI em termos de eficiência.`;
    }

    // Navio específico
    const vesselMentioned = vessels.find(v => 
      q.includes(v.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || 
      q.includes(v.sigla.toLowerCase())
    );
    if (vesselMentioned) {
      const report = iwsReports.find(r => 
        r.vessel.toLowerCase() === vesselMentioned.name.toLowerCase() ||
        r.sigla === vesselMentioned.sigla
      );
      const docking = dockingSchedule.filter(d => 
        d.vessel.toLowerCase() === vesselMentioned.name.toLowerCase()
      );
      const paint = paintApplications.find(p => p.sigla === vesselMentioned.sigla);
      
      let response = `🚢 **${vesselMentioned.name} (${vesselMentioned.sigla})**\n\n` +
        `**Dados Técnicos:**\n` +
        `• Classe: ${vesselMentioned.class}\n` +
        `• Tipo: ${vesselMentioned.type}\n` +
        `• Porte Bruto: ${vesselMentioned.deadweight.toLocaleString()} ton\n` +
        `• Dimensões: ${vesselMentioned.length}m x ${vesselMentioned.beam}m x ${vesselMentioned.draft}m\n` +
        `• Pontal: ${vesselMentioned.depth}m\n\n` +
        `**Status Operacional:**\n` +
        `• Status: ${vesselMentioned.status === 'navegando' ? '🟢 Navegando' : vesselMentioned.status === 'atracado' ? '🟡 Atracado' : '🔴 Manutenção'}\n` +
        `• Velocidade: ${vesselMentioned.speed} nós\n` +
        `• Posição: ${vesselMentioned.latitude.toFixed(4)}°, ${vesselMentioned.longitude.toFixed(4)}°\n\n` +
        `**Bioincrustação:**\n` +
        `• Bio Score: **${vesselMentioned.bioScore}%** ${vesselMentioned.bioScore >= 70 ? '⚠️' : vesselMentioned.bioScore >= 40 ? '⚡' : '✅'}\n` +
        `• Última limpeza: ${new Date(vesselMentioned.lastCleaning).toLocaleDateString('pt-BR')}\n` +
        `• Próxima limpeza: ${new Date(vesselMentioned.nextCleaning).toLocaleDateString('pt-BR')}\n\n` +
        `**Consumo:**\n` +
        `• Combustível: ${vesselMentioned.fuelConsumption} ton/dia\n` +
        `• Emissões CO₂: ${vesselMentioned.co2Emissions} ton/dia`;
      
      if (report) {
        response += `\n\n**Último Relatório IWS:**\n` +
          `• Data: ${new Date(report.date).toLocaleDateString('pt-BR')}\n` +
          `• Local: ${report.location}\n` +
          `• Condição geral: ${report.condition}\n` +
          `• Tipo: ${report.foulingType}\n` +
          `• Fundo: ${report.flatBottom} | Costado: ${report.side} | Hélice: ${report.propeller}`;
      }
      
      if (paint) {
        response += `\n\n**Tinta Anti-Incrustante:**\n` +
          `• Última aplicação: ${new Date(paint.applicationDate).toLocaleDateString('pt-BR')}\n` +
          `• Período verificação: ${paint.verificationPeriod} dias`;
      }
      
      if (docking.length > 0) {
        response += `\n\n**Histórico de Docagem:**\n` +
          docking.map(d => `• ${new Date(d.date).toLocaleDateString('pt-BR')} - ${d.type}`).join('\n');
      }
      
      return response;
    }

    // Normas e regulamentações
    if (q.includes('norma') || q.includes('regulamento') || q.includes('imo') || q.includes('regra')) {
      return `📜 **Normas e Regulamentações:**\n\n` +
        `**IMO (Organização Marítima Internacional):**\n` +
        `• MARPOL Anexo VI - Emissões atmosféricas\n` +
        `• IMO 2020 - Limite de enxofre 0.5%\n` +
        `• Intervalo máximo entre docagens: 60 meses\n\n` +
        `**Petrobras/Transpetro:**\n` +
        `• Relatório IWS obrigatório após inspeção\n` +
        `• Escala NORMAN 401 para avaliação\n` +
        `• Certificação IMCA para mergulhadores\n` +
        `• Autorização prévia do terminal\n\n` +
        `**Ambientais:**\n` +
        `• Coleta obrigatória de resíduos de limpeza\n` +
        `• Proibição de biocidas não aprovados\n` +
        `• Controle de espécies invasoras`;
    }

    // Emissões CO2
    if (q.includes('co2') || q.includes('emissao') || q.includes('carbono') || q.includes('poluicao')) {
      const totalEmissions = vessels.reduce((acc, v) => acc + v.co2Emissions, 0);
      return `🌍 **Emissões de CO₂ da Frota:**\n\n` +
        `**Total Atual:** ${totalEmissions.toFixed(1)} ton/dia\n\n` +
        `**Por Classe (média):**\n` +
        `• Suezmax: ~160 ton CO₂/dia\n` +
        `• Aframax: ~130 ton CO₂/dia\n` +
        `• MR2: ~88 ton CO₂/dia\n` +
        `• Gaseiro 7k: ~38 ton CO₂/dia\n\n` +
        `**Impacto da Bioincrustação:**\n` +
        `• 10% Bio Score → +3-5% emissões\n` +
        `• 50% Bio Score → +8-10% emissões\n` +
        `• 70% Bio Score → +12-15% emissões\n\n` +
        `**Taxa de Carbono:** $${economicImpact.co2CostPerTon}/ton CO₂\n\n` +
        `💡 Limpeza regular pode reduzir emissões de CO₂ em **5-15%** por embarcação.`;
    }

    // Ajuda / O que você pode fazer
    if (q.includes('ajuda') || q.includes('help') || q.includes('o que voce pode') || q.includes('o que voce sabe')) {
      return `🤖 **Posso Ajudar Com:**\n\n` +
        `**📊 Dados da Frota:**\n` +
        `• Status das 21 embarcações\n` +
        `• Localização e trajetos\n` +
        `• Consumo de combustível\n` +
        `• Níveis de bioincrustação\n\n` +
        `**🔧 Procedimentos:**\n` +
        `• Limpeza preventiva e corretiva\n` +
        `• Docagem e manutenção\n` +
        `• Segurança e EPIs\n` +
        `• Normas e regulamentações\n\n` +
        `**📈 Análises:**\n` +
        `• Impacto econômico da bioincrustação\n` +
        `• Custos de manutenção\n` +
        `• Emissões de CO₂\n` +
        `• Relatórios IWS\n\n` +
        `**📖 Dados Técnicos:**\n` +
        `• Escalas Beaufort e NORMAN\n` +
        `• Tipos de incrustação\n` +
        `• Combustíveis marítimos\n` +
        `• Dicionário de dados\n\n` +
        `💡 Pergunte sobre qualquer embarcação pelo nome ou sigla!`;
    }

    // Resposta padrão mais inteligente
    const keywords = ['status', 'limpeza', 'combustivel', 'navio', 'frota', 'bioincrustacao', 'epi', 'seguranca', 
      'docagem', 'custo', 'emissao', 'relatorio', 'beaufort', 'norman', 'classe', 'tinta', 'helice', 'porto'];
    
    const foundKeyword = keywords.find(k => q.includes(k));
    if (foundKeyword) {
      return `Detectei interesse em "${foundKeyword}". Posso fornecer informações mais detalhadas.\n\n` +
        `**Tente perguntar:**\n` +
        `• "Qual o status atual da frota?"\n` +
        `• "Quais navios precisam de limpeza?"\n` +
        `• "O que é bioincrustação?"\n` +
        `• "Quanto custa uma docagem?"\n` +
        `• "Me fale sobre o [nome do navio]"\n\n` +
        `Ou digite "ajuda" para ver todas as opções.`;
    }

    return `Entendi sua pergunta: "${question}"\n\n` +
      `Sou especializado em informações sobre a frota Transpetro. Posso ajudar com:\n\n` +
      `• **Embarcações:** dados técnicos, localização, status operacional\n` +
      `• **Bioincrustação:** causas, impactos, prevenção, escalas\n` +
      `• **Manutenção:** limpeza, docagem, procedimentos, custos\n` +
      `• **Segurança:** EPIs, normas, regulamentações\n` +
      `• **Economia:** consumo, emissões, custos operacionais\n\n` +
      `💡 Digite **"ajuda"** para ver todas as opções ou pergunte sobre um navio específico pelo nome.`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 800));

    const response = generateResponse(userMessage.content);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 flex flex-col">
        <div className="container mx-auto px-4 flex-1 flex flex-col max-w-4xl py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Assistente ShipSense AI</h1>
            <p className="text-sm text-muted-foreground">
              Treinado com dados reais da Petrobras/Transpetro • 21 embarcações • +138.000 registros
            </p>
          </motion.div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 justify-center mb-6"
            >
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs px-3 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  {question}
                </button>
              ))}
            </motion.div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'glass-card'
                  )}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    {message.content.split('\n').map((line, i) => {
                      // Handle bold text
                      const parts = line.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={i} className="mb-1">
                          {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={j}>{part.slice(2, -2)}</strong>;
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>
                  <p className={cn(
                    "text-xs mt-2",
                    message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}>
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="glass-card rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Consultando base de dados...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="glass-card rounded-2xl p-2">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Pergunte sobre a frota, procedimentos, custos..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
