-- Create alerts table for Bio Score notifications
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vessel_id TEXT NOT NULL,
  vessel_name TEXT NOT NULL,
  vessel_sigla TEXT NOT NULL,
  bio_score INTEGER NOT NULL,
  alert_type TEXT NOT NULL DEFAULT 'warning',
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read alerts (public dashboard)
CREATE POLICY "Alerts are publicly viewable" 
ON public.alerts 
FOR SELECT 
USING (true);

-- Allow insert from edge functions
CREATE POLICY "Allow insert alerts" 
ON public.alerts 
FOR INSERT 
WITH CHECK (true);

-- Allow update for marking as read
CREATE POLICY "Allow update alerts" 
ON public.alerts 
FOR UPDATE 
USING (true);

-- Enable realtime for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;