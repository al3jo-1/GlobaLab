import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const SYSTEM_PROMPT = `Eres un experto asistente de educación financiera y trading. Tu objetivo es enseñar conceptos de finanzas, inversión y trading de manera clara y educativa. 

Características de tus respuestas:
- Explicaciones detalladas pero comprensibles para estudiantes
- Ejemplos prácticos y relevantes
- Énfasis en la gestión de riesgos y educación responsable
- Información actualizada sobre mercados financieros
- Respuestas en el idioma del usuario (español, inglés, etc.)

Temas que dominas:
- Acciones, bonos, ETFs y otros instrumentos financieros
- Criptomonedas y blockchain
- Análisis técnico y fundamental
- Gestión de riesgos y diversificación
- Psicología del trading
- Mercados forex
- Indicadores y estrategias de trading
- Conceptos económicos básicos

Siempre recuerda que estás educando a estudiantes, así que sé claro, paciente y educativo.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'es' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || !openai) {
      console.log('OpenAI API key not configured, using fallback mode');
      return res.json({ 
        error: 'AI service not configured',
        fallback: true,
        response: null
      });
    }

    const systemPrompt = language === 'es' ? SYSTEM_PROMPT : 
      `You are an expert financial education and trading assistant. Your goal is to teach finance, investment and trading concepts clearly and educationally.

Your response characteristics:
- Detailed but understandable explanations for students
- Practical and relevant examples
- Emphasis on risk management and responsible education
- Updated information on financial markets
- Responses in the user's language

Topics you master:
- Stocks, bonds, ETFs and other financial instruments
- Cryptocurrencies and blockchain
- Technical and fundamental analysis
- Risk management and diversification
- Trading psychology
- Forex markets
- Trading indicators and strategies
- Basic economic concepts

Always remember you are educating students, so be clear, patient and educational.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({ 
      response: aiResponse,
      model: 'gpt-5',
      enhanced: true 
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Return fallback response if API fails
    const errorMessage = error?.status === 429 
      ? 'OpenAI quota exceeded. Using fallback mode.'
      : error.message;
    
    res.json({ 
      error: errorMessage,
      fallback: true,
      response: null
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    aiEnabled: !!process.env.OPENAI_API_KEY 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`AI enabled: ${!!process.env.OPENAI_API_KEY}`);
});
