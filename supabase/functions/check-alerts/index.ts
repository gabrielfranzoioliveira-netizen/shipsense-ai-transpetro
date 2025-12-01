import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Vessel data for checking Bio Scores
const vessels = [
  { id: '1', name: 'RAFAEL SANTOS', sigla: 'RAS', bioScore: 35 },
  { id: '2', name: 'HENRIQUE ALVES', sigla: 'HAL', bioScore: 55 },
  { id: '3', name: 'VICTOR OLIVEIRA', sigla: 'VOL', bioScore: 30 },
  { id: '4', name: 'FELIPE RIBEIRO', sigla: 'FRB', bioScore: 80 },
  { id: '5', name: 'GISELLE CARVALHO', sigla: 'GIC', bioScore: 10 },
  { id: '6', name: 'RAUL MARTINS', sigla: 'RMA', bioScore: 50 },
  { id: '7', name: 'PAULO MOURA', sigla: 'PMO', bioScore: 75 },
  { id: '8', name: 'MARCOS CAVALCANTI', sigla: 'MCA', bioScore: 5 },
  { id: '9', name: 'DANIEL PEREIRA', sigla: 'DAP', bioScore: 20 },
  { id: '10', name: 'CARLA SILVA', sigla: 'CSI', bioScore: 100 },
  { id: '11', name: 'RENATO GOMES', sigla: 'REG', bioScore: 20 },
  { id: '12', name: 'GABRIELA MARTINS', sigla: 'GMA', bioScore: 45 },
  { id: '13', name: 'RODRIGO PINHEIRO', sigla: 'RPI', bioScore: 80 },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Checking vessels for Bio Score alerts...');

    const criticalVessels = vessels.filter(v => v.bioScore >= 70);
    const newAlerts = [];

    for (const vessel of criticalVessels) {
      // Check if alert already exists for this vessel (not read)
      const { data: existingAlert } = await supabase
        .from('alerts')
        .select('id')
        .eq('vessel_id', vessel.id)
        .eq('is_read', false)
        .single();

      if (!existingAlert) {
        const alertType = vessel.bioScore >= 80 ? 'critical' : 'warning';
        const message = vessel.bioScore >= 80
          ? `🔴 CRÍTICO: ${vessel.name} (${vessel.sigla}) atingiu Bio Score de ${vessel.bioScore}%. Limpeza urgente necessária!`
          : `⚠️ ATENÇÃO: ${vessel.name} (${vessel.sigla}) com Bio Score de ${vessel.bioScore}%. Considere agendar limpeza.`;

        const { data, error } = await supabase
          .from('alerts')
          .insert({
            vessel_id: vessel.id,
            vessel_name: vessel.name,
            vessel_sigla: vessel.sigla,
            bio_score: vessel.bioScore,
            alert_type: alertType,
            message: message,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating alert:', error);
        } else {
          console.log('Created alert for:', vessel.name);
          newAlerts.push(data);
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      newAlerts: newAlerts.length,
      criticalVessels: criticalVessels.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Check alerts error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
