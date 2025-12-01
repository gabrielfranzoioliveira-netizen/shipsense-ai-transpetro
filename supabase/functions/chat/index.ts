import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Você é o ShipSense AI, um assistente especializado em operações marítimas da Petrobras/Transpetro.

## Sua Base de Conhecimento:

### Frota (21 embarcações):
- **Suezmax (8 navios)**: Rafael Santos, Henrique Alves, Victor Oliveira, Felipe Ribeiro, Giselle Carvalho, Raul Martins, Paulo Moura, Marcos Cavalcanti
  - Tipo: Petroleiro | Porte: ~156.000 ton | Dimensões: 274.2m x 48m x 17m
  - Consumo médio: 50 ton/dia | Emissões: ~160 ton CO₂/dia

- **Aframax (5 navios)**: Daniel Pereira, Carla Silva, Renato Gomes, Gabriela Martins, Rodrigo Pinheiro
  - Tipo: Petroleiro | Porte: ~114.000 ton | Dimensões: 249m x 43.8m x 15m
  - Consumo médio: 42 ton/dia | Emissões: ~130 ton CO₂/dia

- **MR 2 (4 navios)**: Eduardo Costa, Thiago Fernandes, Romario Silva, Lucas Mendonça
  - Tipo: Petroleiro (Product Carrier) | Porte: ~48.500 ton | Dimensões: 182.85m x 32.2m x 12.8m
  - Consumo médio: 28 ton/dia | Emissões: ~88 ton CO₂/dia

- **Gaseiro 7k (4 navios)**: Ricardo Barbosa, Bruno Lima, Fábio Santos, Maria Valentina
  - Tipo: Gaseiro (LPG) | Porte: ~5.090 ton | Dimensões: 117.63m x 19.2m x 5.8m
  - Consumo médio: 12 ton/dia | Emissões: ~38 ton CO₂/dia

### Bioincrustação:
- **Definição**: Acúmulo de organismos marinhos (cracas, algas, mexilhões) no casco
- **Impacto no consumo**: Bio Score 10%=+2%, 30%=+5%, 50%=+9%, 70%=+12%, 90%=+15%
- **Tipos**: Moles (algas, limo) - fácil remoção | Duras (cracas, calcárea) - difícil remoção
- **Prevenção**: Tintas anti-incrustantes, limpeza regular, evitar longos períodos parado

### Escalas:
- **NORMAN 401**: 0=limpo, 1=<10%, 2=10-20%, 3=20-40%, 4=40-60%, 5=>60%
- **Beaufort**: 0-8 (intensidade do vento e estado do mar)

### Custos de Referência:
- Combustível LSHFO 0.5: ~$650/ton
- Taxa CO₂: ~$85/ton
- Limpeza subaquática: $15.000-40.000
- Docagem especial: $500.000-2.000.000

### Procedimentos:
- **Limpeza Preventiva**: Bio Score 30-50%, a cada 3-4 meses em águas tropicais
- **Limpeza Corretiva**: Bio Score >60%, emergencial
- **Docagem**: Máximo 60 meses entre docagens (IMO)

### EPIs para Mergulho:
- Roupa neoprene 5mm, capacete com comunicação, luvas anti-corte
- Cilindro (mín. 2h), colete classe I, faca emergência, rádio VHF

### Portos Principais:
- Brasil: Angra dos Reis/RJ, São Sebastião/SP, Salvador/BA, Fortaleza/CE
- Internacional: Singapura, Rotterdam/NL, Gibraltar, Fujairah/UAE

## Diretrizes:
1. Responda SEMPRE em português brasileiro
2. Use emojis para tornar a leitura mais agradável (🚢, ⛽, 📊, ⚠️, etc.)
3. Formate respostas com **negrito** para termos importantes
4. Seja conciso mas completo
5. Se não souber algo específico, indique que pode ajudar com informações gerais
6. Para perguntas sobre navios específicos, forneça dados técnicos quando relevante
7. Sempre considere o impacto econômico e ambiental nas recomendações`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    console.log('Received messages:', messages.length);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Calling Lovable AI Gateway...');
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log('Streaming response...');
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
