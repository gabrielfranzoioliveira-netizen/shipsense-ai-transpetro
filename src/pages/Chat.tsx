import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, Ship, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { vessels, cleaningReports, maintenanceSchedule } from '@/data/vessels';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  'Qual o status atual da frota?',
  'Quais navios precisam de limpeza urgente?',
  'Como reduzir o consumo de combustível?',
  'Quais EPIs usar para limpeza de casco?',
  'Qual o procedimento para registro de anomalia?',
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o assistente ShipSense AI. Posso ajudá-lo com informações sobre a frota, procedimentos de manutenção, normas de segurança marítima e muito mais. Como posso ajudar?',
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
    const q = question.toLowerCase();

    // Status da frota
    if (q.includes('status') && (q.includes('frota') || q.includes('navios'))) {
      const navegando = vessels.filter(v => v.status === 'navegando').length;
      const atracado = vessels.filter(v => v.status === 'atracado').length;
      const manutencao = vessels.filter(v => v.status === 'manutencao').length;
      return `📊 **Status Atual da Frota Transpetro:**\n\n` +
        `• **${vessels.length}** embarcações totais\n` +
        `• **${navegando}** em navegação\n` +
        `• **${atracado}** atracadas\n` +
        `• **${manutencao}** em manutenção\n\n` +
        `A frota está operando normalmente com ${Math.round((navegando/vessels.length)*100)}% das embarcações ativas.`;
    }

    // Limpeza urgente
    if (q.includes('limpeza') && (q.includes('urgente') || q.includes('precisam'))) {
      const urgentVessels = vessels.filter(v => v.bioScore >= 70);
      if (urgentVessels.length === 0) {
        return '✅ Nenhuma embarcação requer limpeza urgente no momento. Todos os Bio Scores estão abaixo de 70%.';
      }
      let response = `⚠️ **Embarcações que requerem atenção urgente:**\n\n`;
      urgentVessels.forEach(v => {
        response += `• **${v.name}** - Bio Score: ${v.bioScore}% (${v.class})\n`;
      });
      response += `\nRecomendação: Agendar limpeza imediata para evitar aumento no consumo de combustível.`;
      return response;
    }

    // Consumo de combustível
    if (q.includes('consumo') || q.includes('combustível') || q.includes('economizar')) {
      return `💡 **Dicas para Reduzir o Consumo de Combustível:**\n\n` +
        `1. **Manter Bio Score abaixo de 40%** - A bioincrustação pode aumentar o consumo em até 15%\n\n` +
        `2. **Otimizar velocidade** - Manter velocidade constante entre 10-12 nós\n\n` +
        `3. **Limpeza preventiva** - Realizar limpezas quando Bio Score atinge 40-50%\n\n` +
        `4. **Monitorar hélice** - Priorizar limpeza do hélice, responsável por 80% da eficiência\n\n` +
        `5. **Planejamento de rotas** - Usar rotas com correntes favoráveis\n\n` +
        `📈 Economia potencial: até R$ 630.000/semestre com limpezas otimizadas.`;
    }

    // EPIs
    if (q.includes('epi') || q.includes('segurança') || q.includes('equipamento')) {
      return `🛡️ **EPIs para Limpeza de Casco:**\n\n` +
        `**Equipamentos Obrigatórios:**\n` +
        `• Roupa de mergulho completa (neoprene 5mm)\n` +
        `• Capacete de mergulho com comunicação\n` +
        `• Luvas de proteção (anti-corte)\n` +
        `• Botas de segurança aquática\n` +
        `• Cilindro de ar comprimido (mín. 2h)\n\n` +
        `**Equipamentos de Emergência:**\n` +
        `• Colete salva-vidas\n` +
        `• Faca de emergência\n` +
        `• Sinalizador luminoso\n` +
        `• Rádio comunicador backup\n\n` +
        `⚠️ Sempre verificar condições do mar antes de iniciar operações.`;
    }

    // Anomalia / registro
    if (q.includes('anomalia') || q.includes('registro') || q.includes('reportar')) {
      return `📝 **Procedimento para Registro de Anomalia:**\n\n` +
        `**1. Identificação**\n` +
        `• Localizar área afetada no casco\n` +
        `• Documentar com fotos/vídeo ROV\n` +
        `• Registrar coordenadas GPS\n\n` +
        `**2. Classificação**\n` +
        `• Leve: incrustação superficial (<20%)\n` +
        `• Moderada: incrustação média (20-60%)\n` +
        `• Severa: incrustação pesada (>60%)\n\n` +
        `**3. Documentação**\n` +
        `• Preencher formulário IWS\n` +
        `• Anexar evidências visuais\n` +
        `• Enviar ao supervisor de manutenção\n\n` +
        `**4. Ação Corretiva**\n` +
        `• Definir prioridade de intervenção\n` +
        `• Agendar limpeza ou docagem`;
    }

    // Navio específico
    const vesselMentioned = vessels.find(v => 
      q.includes(v.name.toLowerCase()) || q.includes(v.sigla.toLowerCase())
    );
    if (vesselMentioned) {
      const report = cleaningReports.find(r => 
        r.vessel.toLowerCase() === vesselMentioned.name.toLowerCase()
      );
      let response = `🚢 **${vesselMentioned.name} (${vesselMentioned.sigla})**\n\n` +
        `**Dados Técnicos:**\n` +
        `• Classe: ${vesselMentioned.class}\n` +
        `• Tipo: ${vesselMentioned.type}\n` +
        `• Porte Bruto: ${vesselMentioned.deadweight.toLocaleString()} ton\n` +
        `• Comprimento: ${vesselMentioned.length}m | Boca: ${vesselMentioned.beam}m\n\n` +
        `**Status Operacional:**\n` +
        `• Status: ${vesselMentioned.status}\n` +
        `• Bio Score: ${vesselMentioned.bioScore}%\n` +
        `• Consumo: ${vesselMentioned.fuelConsumption} ton/dia\n` +
        `• Emissões CO₂: ${vesselMentioned.co2Emissions} ton/dia\n\n` +
        `**Manutenção:**\n` +
        `• Última limpeza: ${new Date(vesselMentioned.lastCleaning).toLocaleDateString('pt-BR')}\n` +
        `• Próxima limpeza: ${new Date(vesselMentioned.nextCleaning).toLocaleDateString('pt-BR')}`;
      
      if (report) {
        response += `\n\n**Último Relatório IWS:**\n` +
          `• Data: ${report.date}\n` +
          `• Local: ${report.location}\n` +
          `• Condição geral: ${report.overallCondition}\n` +
          `• Tipo de incrustação: ${report.foulingType}`;
      }
      return response;
    }

    // Procedimentos / normas
    if (q.includes('procedimento') || q.includes('norma') || q.includes('regra')) {
      return `📋 **Normas e Procedimentos Petrobras:**\n\n` +
        `**Inspeção de Casco:**\n` +
        `• Frequência: a cada 3-4 meses em águas tropicais\n` +
        `• Método: ROV ou mergulho comercial\n` +
        `• Documentação: Relatório IWS obrigatório\n\n` +
        `**Limpeza Subaquática:**\n` +
        `• Autorização prévia do terminal\n` +
        `• Equipe certificada IMCA\n` +
        `• Coleta de resíduos obrigatória\n\n` +
        `**Docagem:**\n` +
        `• Intervalo máximo: 60 meses\n` +
        `• Inspeção de classe obrigatória\n` +
        `• Renovação de tintas antincrustantes\n\n` +
        `Para mais detalhes, consulte o Manual do Participante.`;
    }

    // Resposta padrão
    return `Entendi sua pergunta sobre "${question}". \n\nPosso ajudá-lo com informações sobre:\n\n` +
      `• Status da frota e embarcações específicas\n` +
      `• Procedimentos de limpeza e manutenção\n` +
      `• Normas de segurança marítima\n` +
      `• Redução de consumo de combustível\n` +
      `• Relatórios de inspeção IWS\n` +
      `• Equipamentos de proteção (EPIs)\n\n` +
      `Por favor, faça uma pergunta mais específica para que eu possa fornecer informações detalhadas.`;
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

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

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
              Tire dúvidas sobre a frota, procedimentos e normas marítimas
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
                  className="text-xs px-3 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
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
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
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
                    <span className="text-sm text-muted-foreground">Analisando...</span>
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
                placeholder="Digite sua pergunta..."
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
