// Base de Conhecimento ShipSense AI - Dados Reais Petrobras/Transpetro

export const fleetInfo = {
  totalVessels: 21,
  classes: {
    suezmax: { count: 8, type: 'Petroleiro', avgDeadweight: 156803 },
    aframax: { count: 5, type: 'Petroleiro', avgDeadweight: 114457 },
    mr2: { count: 4, type: 'Petroleiro', avgDeadweight: 48524 },
    gaseiro7k: { count: 4, type: 'Gaseiro', avgDeadweight: 5091 }
  },
  fuelTypes: ['LSHFO 0.5', 'ULSMGO 0.1'],
  operations: ['NAVEGACAO', 'ATRACADO', 'MANUTENCAO', 'DOCAGEM']
};

export const dataDictionary = {
  sessionId: 'Código de Sessão do Navio - identificador único por viagem',
  shipName: 'Nome do Navio',
  class: 'Classe do Navio (Suezmax, Aframax, MR2, Gaseiro 7k)',
  eventName: 'Evento de navegação (NAVEGACAO, ATRACADO, etc.)',
  startGMTDate: 'Data de início do evento (GMT)',
  endGMTDate: 'Data de final do evento (GMT)',
  duration: 'Duração do evento em horas',
  distance: 'Distância navegada em milhas náuticas (nm)',
  aftDraft: 'Calado a ré em metros',
  fwdDraft: 'Calado a vante em metros',
  midDraft: 'Calado a meia-nau em metros',
  TRIM: 'Diferença entre calado a ré e calado a vante em metros',
  displacement: 'Peso do volume de água deslocado pelo navio em toneladas',
  beaufortScale: 'Escala Beaufort (intensidade do vento)',
  seaCondition: 'Condição do mar',
  beaufortScaleDesc: 'Descrição da escala Beaufort',
  seaConditionDesc: 'Descrição das condições do mar',
  speed: 'Velocidade de navegação em nós',
  speedGps: 'Velocidade GPS em nós',
  Porto: 'Cidade onde se localiza o Porto',
  decLatitude: 'Latitude da embarcação',
  decLongitude: 'Longitude da embarcação',
  consumedQuantity: 'Consumo de combustível do MCP em toneladas',
  description: 'Tipo de combustível utilizado (LSHFO 0.5, ULSMGO 0.1)',
  porteBruto: 'Capacidade de carga do navio em toneladas métricas',
  comprimentoTotal: 'Maior distância entre pontos extremos (proa a popa) em metros',
  boca: 'Maior largura do casco em metros',
  calado: 'Distância vertical da quilha até a linha d\'água em metros',
  pontal: 'Distância vertical da quilha ao convés principal em metros'
};

export const beaufortScale = {
  0: { desc: 'Calm', wind: '< 1 nó', seaState: 'Espelhado' },
  1: { desc: 'Light air', wind: '1-3 nós', seaState: 'Marolas' },
  2: { desc: 'Light breeze', wind: '4-6 nós', seaState: 'Ondulações suaves' },
  3: { desc: 'Gentle breeze', wind: '7-10 nós', seaState: 'Ondulações moderadas' },
  4: { desc: 'Moderate breeze', wind: '11-16 nós', seaState: 'Ondas pequenas' },
  5: { desc: 'Fresh breeze', wind: '17-21 nós', seaState: 'Ondas moderadas' },
  6: { desc: 'Strong breeze', wind: '22-27 nós', seaState: 'Ondas grandes' },
  7: { desc: 'Near gale', wind: '28-33 nós', seaState: 'Mar agitado' },
  8: { desc: 'Gale', wind: '34-40 nós', seaState: 'Mar muito agitado' }
};

export const seaConditions = {
  1: 'Calm (rippled) - Mar calmo com pequenas ondulações',
  2: 'Smooth (wavelets) - Mar tranquilo com pequenas ondas',
  3: 'Slight - Mar agitado leve',
  4: 'Moderate - Mar moderado',
  5: 'Rough - Mar agitado',
  6: 'Very rough - Mar muito agitado'
};

export const foulingTypes = {
  moles: 'Incrustações moles (algas, limo) - mais fáceis de remover',
  duras: 'Incrustações duras (cracas, calcárea) - requerem limpeza mecânica',
  craca: 'Cracas - organismos com conchas calcárias, alta resistência',
  alga: 'Algas - vegetação marinha, causa atrito moderado',
  limo: 'Limo - camada viscosa de micro-organismos',
  calcarea: 'Calcárea - depósitos minerais endurecidos'
};

export const normanRating = {
  0: 'Superfície limpa, sem incrustação visível',
  1: 'Incrustação muito leve (<10% da superfície)',
  2: 'Incrustação leve (10-20% da superfície)',
  3: 'Incrustação moderada (20-40% da superfície)',
  4: 'Incrustação significativa (40-60% da superfície)',
  5: 'Incrustação severa (>60% da superfície)'
};

export const cleaningProcedures = {
  preventive: {
    title: 'Limpeza Preventiva',
    description: 'Realizada quando Bio Score atinge 30-50%',
    frequency: 'A cada 3-4 meses em águas tropicais',
    method: 'Mergulho comercial ou ROV',
    benefits: 'Reduz consumo de combustível em até 8%'
  },
  corrective: {
    title: 'Limpeza Corretiva',
    description: 'Realizada quando Bio Score ultrapassa 60%',
    frequency: 'Emergencial quando necessário',
    method: 'Limpeza mecânica intensiva',
    benefits: 'Restaura eficiência hidrodinâmica'
  },
  docking: {
    title: 'Docagem Especial',
    description: 'Manutenção completa em dique seco',
    frequency: 'Máximo de 60 meses entre docagens',
    method: 'Jateamento e repintura completa',
    benefits: 'Renovação total do sistema anti-incrustante'
  }
};

export const safetyProcedures = {
  epis: [
    'Roupa de mergulho completa (neoprene 5mm mínimo)',
    'Capacete de mergulho com sistema de comunicação',
    'Luvas de proteção anti-corte (Kevlar)',
    'Botas de segurança aquática',
    'Cilindro de ar comprimido (autonomia mínima 2h)',
    'Colete salva-vidas classe I',
    'Faca de emergência com bainha',
    'Sinalizador luminoso estroboscópico',
    'Rádio comunicador backup VHF',
    'Bóia de sinalização de superfície'
  ],
  preOperationChecklist: [
    'Verificar condições meteorológicas (Beaufort < 4)',
    'Confirmar autorização do terminal/porto',
    'Briefing de segurança com toda equipe',
    'Teste de comunicação antes do mergulho',
    'Verificar equipamentos de emergência',
    'Confirmar disponibilidade de embarcação de apoio',
    'Notificar autoridade marítima local'
  ],
  emergencyProcedures: [
    'Acionar sinal de emergência no rádio',
    'Iniciar subida controlada (não exceder 9m/min)',
    'Sinalizar com bóia de superfície',
    'Aguardar resgate mantendo flutuabilidade',
    'Comunicar status a cada 30 segundos'
  ]
};

export const fuelConsumptionImpact = {
  bioScore10: { consumptionIncrease: '1-2%', description: 'Incrustação mínima' },
  bioScore30: { consumptionIncrease: '3-5%', description: 'Incrustação leve' },
  bioScore50: { consumptionIncrease: '6-9%', description: 'Incrustação moderada' },
  bioScore70: { consumptionIncrease: '10-12%', description: 'Incrustação significativa' },
  bioScore90: { consumptionIncrease: '13-15%', description: 'Incrustação severa' }
};

export const economicImpact = {
  fuelCostPerTon: 650, // USD
  co2CostPerTon: 85, // USD (taxa de carbono)
  avgDailyConsumption: {
    suezmax: 50, // toneladas/dia
    aframax: 42,
    mr2: 28,
    gaseiro7k: 12
  },
  cleaningCosts: {
    underwater: { min: 15000, max: 40000, currency: 'USD' },
    docking: { min: 500000, max: 2000000, currency: 'USD' }
  }
};

export const iwsReports = [
  { vessel: 'Carla Silva', sigla: 'CSI', date: '2025-08-29', location: 'Angra dos Reis/RJ', condition: '100%', foulingType: 'Craca, alga e limo', flatBottom: '100%', side: '100%', propeller: '100%' },
  { vessel: 'Raul Martins', sigla: 'RMA', date: '2023-03-30', location: 'São Sebastião/SP', condition: '10%', foulingType: 'Duras no fundo', flatBottom: '10%', side: 'N/A', propeller: '40%' },
  { vessel: 'Eduardo Costa', sigla: 'EDC', date: '2025-01-11', location: 'São Sebastião/SP', condition: '10%', foulingType: 'Moles e duras', flatBottom: '10%', side: '5%', propeller: '80%' },
  { vessel: 'Victor Oliveira', sigla: 'VOL', date: '2021-03-03', location: 'Salvador/BA', condition: '30%', foulingType: 'Cracas e limo', flatBottom: '30%', side: '30%', propeller: '90%' },
  { vessel: 'Giselle Carvalho', sigla: 'GIC', date: '2023-01-10', location: 'Angra dos Reis/RJ', condition: '10%', foulingType: 'Craca, alga e limo', flatBottom: '10%', side: '10%', propeller: '100%' },
  { vessel: 'Daniel Pereira', sigla: 'DAP', date: '2021-01-18', location: 'Salvador/BA', condition: '20%', foulingType: 'Craca, alga e limo', flatBottom: '20%', side: '20%', propeller: '70%' },
  { vessel: 'Felipe Ribeiro', sigla: 'FRB', date: '2021-09-04', location: 'Salvador/BA', condition: '100%', foulingType: 'Craca, alga e limo', flatBottom: '100%', side: '100%', propeller: '100%' },
  { vessel: 'Henrique Alves', sigla: 'HAL', date: '2022-06-21', location: 'Baía de todos os santos/BA', condition: '90%', foulingType: 'Cracas e limo', flatBottom: '100%', side: '80%', propeller: '100%' },
  { vessel: 'Bruno Lima', sigla: 'BRL', date: '2024-05-08', location: 'Ipojuca/PE', condition: '60%', foulingType: 'Cracas e limo', flatBottom: '60%', side: '60%', propeller: '60%' },
  { vessel: 'Fábio Santos', sigla: 'FSA', date: '2024-08-10', location: 'Fortaleza/CE', condition: '0%', foulingType: 'N/A', flatBottom: '0%', side: '0%', propeller: '0%' },
  { vessel: 'Maria Valentina', sigla: 'MVA', date: '2024-11-04', location: 'Fortaleza/CE', condition: '0%', foulingType: 'N/A', flatBottom: '0%', side: '0%', propeller: '0%' },
  { vessel: 'Paulo Moura', sigla: 'PMO', date: '2025-05-18', location: 'Singapura', condition: '70-80%', foulingType: 'Craca, alga e limo', flatBottom: '50-60%', side: '70-80%', propeller: '70-80%' },
  { vessel: 'Rafael Santos', sigla: 'RAS', date: '2025-06-10', location: 'Singapura', condition: '70-80%', foulingType: 'Craca, alga e limo', flatBottom: '60-70%', side: '70-80%', propeller: '70-80%' },
  { vessel: 'Renato Gomes', sigla: 'REG', date: '2025-08-17', location: 'Rotterdam/NL', condition: 'NORMAN 3', foulingType: 'NORMAN', flatBottom: 'NORMAN 3', side: 'NORMAN 3', propeller: 'N/A' },
  { vessel: 'Rodrigo Pinheiro', sigla: 'RPI', date: '2023-08-16', location: 'Fujaira/UAE', condition: '80%', foulingType: 'Craca, alga e limo', flatBottom: '60%', side: '80%', propeller: '90%' },
  { vessel: 'Romario Silva', sigla: 'ROS', date: '2025-11-10', location: 'São Sebastião/SP', condition: '70%', foulingType: 'Moles e duras', flatBottom: '60%', side: '70%', propeller: '20%' },
  { vessel: 'Marcos Cavalcanti', sigla: 'MCA', date: '2024-01-28', location: 'Angra dos Reis/RJ', condition: '5%', foulingType: 'Moles', flatBottom: '0%', side: '5%', propeller: '80%' }
];

export const dockingSchedule = [
  { vessel: 'Victor Oliveira', date: '2023-06-30', type: 'Especial' },
  { vessel: 'Thiago Fernandes', date: '2023-01-18', type: 'Especial' },
  { vessel: 'Romario Silva', date: '2023-05-18', type: 'Especial' },
  { vessel: 'Rodrigo Pinheiro', date: '2024-08-26', type: 'Especial' },
  { vessel: 'Ricardo Barbosa', date: '2021-10-06', type: 'Especial' },
  { vessel: 'Renato Gomes', date: '2024-01-07', type: 'Especial' },
  { vessel: 'Rafael Santos', date: '2022-07-08', type: 'Especial' },
  { vessel: 'Paulo Moura', date: '2021-01-21', type: 'Especial' },
  { vessel: 'Maria Valentina', date: '2022-04-28', type: 'Especial' },
  { vessel: 'Marcos Cavalcanti', date: '2021-05-08', type: 'Especial' },
  { vessel: 'Lucas Mendonça', date: '2024-02-13', type: 'Especial' },
  { vessel: 'Henrique Alves', date: '2022-11-09', type: 'Especial' },
  { vessel: 'Giselle Carvalho', date: '2025-03-22', type: 'Especial' },
  { vessel: 'Gabriela Martins', date: '2024-04-13', type: 'Especial' },
  { vessel: 'Felipe Ribeiro', date: '2024-06-20', type: 'Especial' },
  { vessel: 'Fábio Santos', date: '2022-02-09', type: 'Especial' },
  { vessel: 'Eduardo Costa', date: '2022-02-14', type: 'Especial' },
  { vessel: 'Daniel Pereira', date: '2023-09-13', type: 'Especial' },
  { vessel: 'Carla Silva', date: '2024-02-26', type: 'Especial' },
  { vessel: 'Bruno Lima', date: '2021-09-18', type: 'Especial' },
  { vessel: 'Raul Martins', date: '2025-05-10', type: 'Especial (Próxima)' },
  { vessel: 'Paulo Moura', date: '2025-11-01', type: 'Especial (Próxima)' },
  { vessel: 'Ricardo Barbosa', date: '2025-10-06', type: 'Especial (Próxima)' }
];

export const paintApplications = [
  { sigla: 'RAS', vessel: 'Rafael Santos', class: 'Suezmax', applicationDate: '2022-07-08', verificationPeriod: 52, maxStoppage: 40 },
  { sigla: 'HAL', vessel: 'Henrique Alves', class: 'Suezmax', applicationDate: '2022-11-09', verificationPeriod: 52, maxStoppage: 40 },
  { sigla: 'VOL', vessel: 'Victor Oliveira', class: 'Suezmax', applicationDate: '2016-12-01', verificationPeriod: 35, maxStoppage: 35 },
  { sigla: 'FRB', vessel: 'Felipe Ribeiro', class: 'Suezmax', applicationDate: '2019-01-10', verificationPeriod: 150, maxStoppage: 150 },
  { sigla: 'GIC', vessel: 'Giselle Carvalho', class: 'Suezmax', applicationDate: '2025-03-20', verificationPeriod: 120, maxStoppage: 120 },
  { sigla: 'RMA', vessel: 'Raul Martins', class: 'Suezmax', applicationDate: '2025-05-11', verificationPeriod: 120, maxStoppage: 120 },
  { sigla: 'PMO', vessel: 'Paulo Moura', class: 'Suezmax', applicationDate: '2020-01-21', verificationPeriod: 52, maxStoppage: 40 },
  { sigla: 'MCA', vessel: 'Marcos Cavalcanti', class: 'Suezmax', applicationDate: '2021-05-08', verificationPeriod: 52, maxStoppage: 40 },
  { sigla: 'DAP', vessel: 'Daniel Pereira', class: 'Aframax', applicationDate: '2023-09-19', verificationPeriod: 28, maxStoppage: 28 },
  { sigla: 'CSI', vessel: 'Carla Silva', class: 'Aframax', applicationDate: '2024-02-16', verificationPeriod: 146, maxStoppage: 120 },
  { sigla: 'REG', vessel: 'Renato Gomes', class: 'Aframax', applicationDate: '2020-02-01', verificationPeriod: 35, maxStoppage: 35 },
  { sigla: 'GAM', vessel: 'Gabriela Martins', class: 'Aframax', applicationDate: '2024-04-13', verificationPeriod: 35, maxStoppage: 35 },
  { sigla: 'RPI', vessel: 'Rodrigo Pinheiro', class: 'Aframax', applicationDate: '2024-08-26', verificationPeriod: 90, maxStoppage: 90 },
  { sigla: 'EDC', vessel: 'Eduardo Costa', class: 'MR 2', applicationDate: '2016-08-01', verificationPeriod: 28, maxStoppage: 28 },
  { sigla: 'TFE', vessel: 'Thiago Fernandes', class: 'MR 2', applicationDate: '2017-12-01', verificationPeriod: 28, maxStoppage: 28 },
  { sigla: 'ROS', vessel: 'Romario Silva', class: 'MR 2', applicationDate: '2017-01-01', verificationPeriod: 28, maxStoppage: 28 },
  { sigla: 'LUM', vessel: 'Lucas Mendonça', class: 'MR 2', applicationDate: '2016-01-01', verificationPeriod: 28, maxStoppage: 28 },
  { sigla: 'RBA', vessel: 'Ricardo Barbosa', class: 'Gaseiro 7k', applicationDate: '2018-06-01', verificationPeriod: 28, maxStoppage: 28 },
  { sigla: 'BRL', vessel: 'Bruno Lima', class: 'Gaseiro 7k', applicationDate: '2018-09-01', verificationPeriod: 28, maxStoppage: 28 },
  { sigla: 'FSA', vessel: 'Fábio Santos', class: 'Gaseiro 7k', applicationDate: '2020-05-01', verificationPeriod: 28, maxStoppage: 28 },
  { sigla: 'MVA', vessel: 'Maria Valentina', class: 'Gaseiro 7k', applicationDate: '2020-07-01', verificationPeriod: 28, maxStoppage: 28 }
];

export const biofoulingInfo = {
  definition: 'Bioincrustação é o acúmulo de organismos marinhos (cracas, algas, mexilhões, etc.) no casco de embarcações.',
  causes: [
    'Temperatura da água (águas quentes aceleram crescimento)',
    'Tempo de permanência parado',
    'Salinidade da água',
    'Qualidade da tinta anti-incrustante',
    'Velocidade de navegação (baixas velocidades favorecem)'
  ],
  impacts: [
    'Aumento de 10-40% no consumo de combustível',
    'Redução de 10-15% na velocidade máxima',
    'Aumento nas emissões de CO₂',
    'Desgaste acelerado do motor',
    'Maior custo operacional',
    'Risco de transporte de espécies invasoras'
  ],
  prevention: [
    'Aplicação de tintas anti-incrustantes (CDP/SPC)',
    'Limpeza subaquática regular',
    'Monitoramento contínuo do Bio Score',
    'Evitar longos períodos atracado',
    'Navegação em velocidade adequada'
  ]
};

export const hackathonObjective = `
O objetivo do hackathon é desenvolver soluções que permitam monitorar e prever o nível de bioincrustação 
nos cascos das embarcações da Transpetro, visando eficiência operacional e redução de emissões.

Os participantes podem:
- Utilizar os dados para análise estatística e modelagem preditiva
- Visualizar padrões de bioincrustação
- Prototipar sistemas de monitoramento
- Combinar diferentes fontes de dados (meteorológicos, consumo, etc.)
- Utilizar APIs públicas

Os dados são anonimizados e de uso exclusivo para o hackathon.
`;

export const ports = {
  brazil: [
    { name: 'Angra dos Reis/RJ', coordinates: [-23.0290, -44.3196] },
    { name: 'São Sebastião/SP', coordinates: [-23.8156, -45.3619] },
    { name: 'Salvador/BA', coordinates: [-13.0057, -38.5152] },
    { name: 'Fortaleza/CE', coordinates: [-3.7327, -38.5267] },
    { name: 'Ipojuca/PE', coordinates: [-8.4115, -34.9064] },
    { name: 'Niterói/RJ', coordinates: [-22.9035, -43.1729] }
  ],
  international: [
    { name: 'Singapura', coordinates: [1.2904, 103.8520] },
    { name: 'Rotterdam/NL', coordinates: [51.9225, 4.4792] },
    { name: 'Gibraltar', coordinates: [36.1408, -5.3536] },
    { name: 'Fujairah/UAE', coordinates: [25.2760, 55.2962] }
  ]
};
