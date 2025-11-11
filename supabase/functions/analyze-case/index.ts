import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, caseData } = await req.json();
    console.log('Analyzing medical case with query:', query);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context from case data
    let context = '';
    if (caseData) {
      if (caseData.clinicalNotes) {
        context += `Clinical Notes: ${caseData.clinicalNotes}\n\n`;
      }
      if (caseData.images && caseData.images.length > 0) {
        context += `Medical images uploaded: ${caseData.images.length} image(s)\n\n`;
      }
    }

    const systemPrompt = `You are an AI medical assistant helping clinicians analyze patient cases. 
Provide evidence-based diagnostic insights, suggest possible conditions, recommend tests, and offer clinical recommendations.
Always include confidence scores and reasoning for your suggestions.
Be clear that you are an AI assistant and final decisions should be made by qualified healthcare professionals.`;

    const userPrompt = `${context}Query: ${query}

Please analyze this case and provide:
1. Possible diagnoses with confidence scores and reasoning
2. Suggested diagnostic tests
3. Clinical recommendations`;

    console.log('Calling Lovable AI Gateway...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'provide_medical_analysis',
              description: 'Provide structured medical analysis with diagnoses, tests, and recommendations',
              parameters: {
                type: 'object',
                properties: {
                  diagnoses: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        condition: { type: 'string' },
                        confidence: { type: 'number', minimum: 0, maximum: 100 },
                        reasoning: { type: 'string' }
                      },
                      required: ['condition', 'confidence', 'reasoning']
                    }
                  },
                  suggestedTests: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  recommendations: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                },
                required: ['diagnoses', 'suggestedTests', 'recommendations']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'provide_medical_analysis' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received response from AI Gateway');

    // Extract structured data from tool call
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in response');
    }

    const analysisData = JSON.parse(toolCall.function.arguments);
    
    // Calculate overall confidence from diagnoses
    const overallConfidence = analysisData.diagnoses.length > 0
      ? Math.round(analysisData.diagnoses[0].confidence)
      : 0;

    const result = {
      query,
      confidence: overallConfidence,
      diagnoses: analysisData.diagnoses,
      suggestedTests: analysisData.suggestedTests,
      recommendations: analysisData.recommendations
    };

    console.log('Analysis complete:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-case function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
