import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  vessel_id: string;
  vessel_name: string;
  vessel_sigla: string;
  bio_score: number;
  alert_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
    } else {
      setAlerts(data || []);
    }
  };

  const checkForNewAlerts = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('check-alerts');
      if (error) {
        console.error('Error checking alerts:', error);
      }
      await fetchAlerts();
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  const markAsRead = async (alertId: string) => {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', alertId);

    if (!error) {
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('is_read', false);

    if (!error) {
      setAlerts([]);
    }
  };

  useEffect(() => {
    fetchAlerts();
    checkForNewAlerts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('alerts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts'
        },
        (payload) => {
          setAlerts(prev => [payload.new as Alert, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = alerts.length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 sm:w-96 glass-card rounded-xl border border-border/50 shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Alertas Bio Score</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={checkForNewAlerts}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    {isLoading ? 'Verificando...' : 'Verificar'}
                  </Button>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Limpar
                    </Button>
                  )}
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Nenhum alerta pendente</p>
                    <p className="text-xs mt-1">Todas as embarcações estão com Bio Score aceitável</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={cn(
                          "p-4 hover:bg-secondary/50 transition-colors relative",
                          alert.alert_type === 'critical' && "bg-red-500/5"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            alert.alert_type === 'critical' ? 'bg-red-500/20' : 'bg-orange-500/20'
                          )}>
                            <AlertTriangle className={cn(
                              "w-4 h-4",
                              alert.alert_type === 'critical' ? 'text-red-500' : 'text-orange-500'
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{alert.vessel_name}</span>
                              <Badge variant={alert.alert_type === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                                {alert.bio_score}%
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {alert.message}
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                              {new Date(alert.created_at).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => markAsRead(alert.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
