import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const FinancialChatbot = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: t('chatbot.welcome', { defaultValue: '¡Hola! Soy tu asistente de educación financiera. Puedo ayudarte a aprender sobre trading, inversiones y finanzas. ¿En qué puedo ayudarte?' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const financialKnowledgeBase = {
    es: {
      acciones: "Las acciones son partes de propiedad de una empresa. Cuando compras acciones, te conviertes en accionista y puedes ganar dinero de dos formas: mediante dividendos (parte de las ganancias que la empresa reparte) y mediante la apreciación del precio (cuando el valor de la acción sube).",
      criptomonedas: "Las criptomonedas son monedas digitales descentralizadas que utilizan tecnología blockchain. Bitcoin fue la primera, pero ahora existen miles. Son muy volátiles y pueden ganar o perder valor rápidamente.",
      diversificacion: "La diversificación es no poner todos tus huevos en una misma canasta. Significa invertir en diferentes tipos de activos (acciones, bonos, cripto) para reducir el riesgo. Si una inversión baja, otras pueden compensar.",
      riesgo: "El riesgo en trading es la posibilidad de perder dinero. Mayor riesgo suele significar mayor potencial de ganancia, pero también mayor posibilidad de pérdida. Es importante solo arriesgar dinero que puedas permitirte perder.",
      apalancamiento: "El apalancamiento permite operar con más dinero del que tienes. Por ejemplo, con apalancamiento 1:10, $100 se convierten en $1000 de poder de compra. CUIDADO: amplifica tanto las ganancias como las pérdidas.",
      mercado: "Un mercado es donde compradores y vendedores intercambian activos. Los precios suben cuando hay más compradores (demanda) que vendedores (oferta), y bajan cuando hay más vendedores.",
      analisis: "Hay dos tipos principales de análisis: Técnico (estudia gráficos y patrones de precios) y Fundamental (estudia la salud financiera de las empresas). Ambos ayudan a tomar decisiones de inversión.",
      volatilidad: "La volatilidad mide cuánto cambia el precio de un activo. Alta volatilidad significa cambios grandes y rápidos. Las criptomonedas suelen ser más volátiles que las acciones tradicionales.",
      portafolio: "Tu portafolio es el conjunto de todas tus inversiones. Un buen portafolio está diversificado y balanceado según tus objetivos y tolerancia al riesgo.",
      estrategia: "Una estrategia de trading es tu plan de acción: cuándo comprar, cuándo vender, cuánto arriesgar. Las estrategias comunes incluyen: day trading (operaciones del mismo día), swing trading (operaciones de días/semanas), y hold (comprar y mantener)."
    },
    en: {
      stocks: "Stocks are shares of ownership in a company. When you buy stocks, you become a shareholder and can profit in two ways: through dividends (part of company profits distributed) and price appreciation (when stock value increases).",
      crypto: "Cryptocurrencies are decentralized digital currencies using blockchain technology. Bitcoin was the first, but thousands now exist. They are highly volatile and can gain or lose value quickly.",
      diversification: "Diversification means not putting all your eggs in one basket. It means investing in different types of assets (stocks, bonds, crypto) to reduce risk. If one investment falls, others may compensate.",
      risk: "Risk in trading is the possibility of losing money. Higher risk usually means higher potential profit, but also higher possibility of loss. It's important to only risk money you can afford to lose.",
      leverage: "Leverage allows you to trade with more money than you have. For example, with 1:10 leverage, $100 becomes $1000 of buying power. WARNING: it amplifies both gains and losses.",
      market: "A market is where buyers and sellers exchange assets. Prices rise when there are more buyers (demand) than sellers (supply), and fall when there are more sellers.",
      analysis: "There are two main types of analysis: Technical (studies charts and price patterns) and Fundamental (studies companies' financial health). Both help make investment decisions.",
      volatility: "Volatility measures how much an asset's price changes. High volatility means large and rapid changes. Cryptocurrencies are usually more volatile than traditional stocks.",
      portfolio: "Your portfolio is the set of all your investments. A good portfolio is diversified and balanced according to your goals and risk tolerance.",
      strategy: "A trading strategy is your action plan: when to buy, when to sell, how much to risk. Common strategies include: day trading (same-day operations), swing trading (days/weeks operations), and hold (buy and hold)."
    }
  };

  const getResponse = (userMessage) => {
    const lang = i18n.language.startsWith('es') ? 'es' : 'en';
    const message = userMessage.toLowerCase();
    const kb = financialKnowledgeBase[lang];

    for (const [key, value] of Object.entries(kb)) {
      if (message.includes(key)) {
        return value;
      }
    }

    if (lang === 'es') {
      return "Interesante pregunta. Puedes preguntarme sobre: acciones, criptomonedas, diversificación, riesgo, apalancamiento, mercado, análisis técnico, volatilidad, portafolio o estrategias de trading.";
    } else {
      return "Interesting question. You can ask me about: stocks, crypto, diversification, risk, leverage, market, analysis, volatility, portfolio or trading strategies.";
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(input);
      const assistantMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chatbot.placeholder', { defaultValue: 'Escribe tu pregunta sobre finanzas...' })}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FinancialChatbot;
