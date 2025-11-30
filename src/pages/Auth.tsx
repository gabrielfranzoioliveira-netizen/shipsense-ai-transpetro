import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ship, Mail, Lock, User, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'login' | 'register' | 'recover';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (result.success) {
          toast({ title: 'Bem-vindo!', description: 'Login realizado com sucesso.' });
          navigate('/dashboard');
        } else {
          toast({ title: 'Erro', description: result.error, variant: 'destructive' });
        }
      } else if (mode === 'register') {
        const result = await register(email, password, name);
        if (result.success) {
          toast({ title: 'Conta criada!', description: 'Sua conta foi criada com sucesso.' });
          navigate('/dashboard');
        } else {
          toast({ title: 'Erro', description: result.error, variant: 'destructive' });
        }
      } else if (mode === 'recover') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({ title: 'Email enviado', description: 'Verifique sua caixa de entrada para redefinir a senha.' });
        setMode('login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/10 to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Ship className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold">
                ShipSense <span className="text-primary">AI</span>
              </span>
            </Link>
            
            <h1 className="text-2xl font-bold mb-2">
              {mode === 'login' && 'Entrar na sua conta'}
              {mode === 'register' && 'Criar nova conta'}
              {mode === 'recover' && 'Recuperar senha'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'login' && 'Digite suas credenciais para acessar'}
              {mode === 'register' && 'Preencha os dados para se cadastrar'}
              {mode === 'recover' && 'Digite seu email para recuperar a senha'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {mode !== 'recover' && (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <button
                type="button"
                onClick={() => setMode('recover')}
                className="text-sm text-primary hover:underline"
              >
                Esqueceu a senha?
              </button>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {mode === 'login' && 'Entrar'}
                  {mode === 'register' && 'Criar conta'}
                  {mode === 'recover' && 'Enviar email'}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            {mode === 'login' && (
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-primary hover:underline font-medium"
                >
                  Cadastre-se
                </button>
              </p>
            )}
            {mode === 'register' && (
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-primary hover:underline font-medium"
                >
                  Entrar
                </button>
              </p>
            )}
            {mode === 'recover' && (
              <button
                onClick={() => setMode('login')}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o login
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
