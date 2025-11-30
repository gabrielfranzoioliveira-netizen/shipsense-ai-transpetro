import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ship, TrendingUp, MessageSquare, BarChart3, Globe, Shield, Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';

const features = [
  {
    icon: TrendingUp,
    title: 'Análise em Tempo Real',
    description: 'Monitore movimentos de navios, congestionamento portuário e tendências de mercado com visualização de dados ao vivo.'
  },
  {
    icon: MessageSquare,
    title: 'Assistente IA',
    description: 'Obtenha respostas instantâneas para consultas marítimas com nosso chatbot avançado com IA.'
  },
  {
    icon: BarChart3,
    title: 'Inteligência Preditiva',
    description: 'Preveja atrasos, otimize rotas e tome decisões baseadas em dados com previsões de IA.'
  },
  {
    icon: Globe,
    title: 'Cobertura Global',
    description: 'Monitore rotas de navegação e portos em todo o mundo com rastreamento global abrangente.'
  },
  {
    icon: Shield,
    title: 'Gestão de Riscos',
    description: 'Identifique e mitigue riscos com detecção avançada de ameaças e monitoramento de conformidade.'
  },
  {
    icon: Anchor,
    title: 'Gestão de Frota',
    description: 'Otimize toda a sua frota com agendamento inteligente e alocação de recursos.'
  }
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Inteligência Artificial Marítima</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Navegue o Futuro da{' '}
              <span className="text-gradient-emerald">Eficiência Marítima</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
              Análise marítima em tempo real, insights com IA e otimização de rotas para a indústria moderna de transporte marítimo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button variant="hero" size="lg" className="gap-2">
                  <Ship className="h-5 w-5" />
                  Começar Agora
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant="heroOutline" size="lg" className="gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Testar IA
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 group hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/20 p-8 md:p-12 text-center"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Pronto para Transformar suas Operações Marítimas?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de profissionais marítimos usando ShipSense AI para otimizar operações e ficar à frente da concorrência.
              </p>
              <Link to="/auth">
                <Button variant="hero" size="lg">
                  Começar Teste Gratuito
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Ship className="h-5 w-5 text-primary" />
              <span className="font-semibold">ShipSense AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 ShipSense AI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
