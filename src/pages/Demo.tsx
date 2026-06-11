import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Bot, Send, Loader2, Sparkles } from 'lucide-react';

const GROQ_API_KEY = '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';

type Message = { role: 'user' | 'assistant'; content: string };

type BizInfo = {
  businessName: string;
  botName: string;
  services: string;
  hours: string;
  pricing: string;
  color: string;
};

const COLORS = [
  { label: 'Purple', value: '#7B61FF' },
  { label: 'Blue', value: '#2563EB' },
  { label: 'Green', value: '#059669' },
  { label: 'Red', value: '#DC2626' },
  { label: 'Orange', value: '#EA580C' },
  { label: 'Pink', value: '#DB2777' },
  { label: 'Black', value: '#111827' },
];

async function askGroq(messages: Message[], biz: BizInfo): Promise<string> {
  const systemPrompt = `You are ${biz.botName}, the friendly AI receptionist for ${biz.businessName}.
Services: ${biz.services}
Hours: ${biz.hours}
Pricing: ${biz.pricing || 'Contact us for pricing'}
Keep replies to 2-3 sentences. Be warm, helpful, and professional. Never make up info not provided. If pricing is not listed say to contact us for a quote.`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 200,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "I'm having a quick issue — please try again!";
}

export default function Demo() {
  const [step, setStep] = useState<'form' | 'chat'>('form');
  const [biz, setBiz] = useState<BizInfo>({
    businessName: '',
    botName: '',
    services: '',
    hours: '',
    pricing: '',
    color: '#7B61FF',
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [messages]);

  function startDemo() {
    if (!biz.businessName || !biz.botName) return;
    setMessages([{
      role: 'assistant',
      content: `Hi there! 👋 I'm ${biz.botName}, the virtual receptionist for ${biz.businessName}. How can I help you today?`,
    }]);
    setStep('chat');
  }

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');
    const updated: Message[] = [...messages, { role: 'user', content: msg }];
    setMessages(updated);
    setLoading(true);
    try {
      const reply = await askGroq(updated, biz);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, try again!' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900">Desklo</span>
        </Link>
        <Link to="/onboarding" className="text-sm text-violet-600 font-medium hover:underline flex items-center gap-1">
          Create real account <ArrowRight size={14} />
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {step === 'form' && (
          <div>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-medium mb-4">
                <Sparkles size={12} />
                Free Demo — No signup required
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Try your AI receptionist
              </h1>
              <p className="text-gray-500">
                Enter your business info and instantly chat with your own AI receptionist. Takes 30 seconds.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name *</label>
                <input
                  value={biz.businessName}
                  onChange={(e) => setBiz({ ...biz, businessName: e.target.value })}
                  placeholder="e.g. Mike's Plumbing Co."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Receptionist name *</label>
                <input
                  value={biz.botName}
                  onChange={(e) => setBiz({ ...biz, botName: e.target.value })}
                  placeholder="e.g. Alex, Sam, or Mike's Assistant"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">What services do you offer?</label>
                <textarea
                  value={biz.services}
                  onChange={(e) => setBiz({ ...biz, services: e.target.value })}
                  placeholder="e.g. Drain cleaning, water heater repair, emergency callouts..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business hours</label>
                <input
                  value={biz.hours}
                  onChange={(e) => setBiz({ ...biz, hours: e.target.value })}
                  placeholder="e.g. Mon–Fri 8am–6pm, Sat 9am–2pm"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pricing (optional)</label>
                <input
                  value={biz.pricing}
                  onChange={(e) => setBiz({ ...biz, pricing: e.target.value })}
                  placeholder="e.g. Water heater repair from $150, drain cleaning $89"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setBiz({ ...biz, color: c.value })}
                      className={`w-9 h-9 rounded-lg border-2 transition-transform hover:scale-110 ${
                        biz.color === c.value ? 'border-gray-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ background: c.value }}
                      title={c.label}
                    />
                  ))}
                  <input
                    type="color"
                    value={biz.color}
                    onChange={(e) => setBiz({ ...biz, color: e.target.value })}
                    className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200"
                    title="Custom color"
                  />
                </div>
              </div>

              <button
                onClick={startDemo}
                disabled={!biz.businessName || !biz.botName}
                className="w-full py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity hover:opacity-90"
                style={{ background: biz.color }}
              >
                Launch my AI receptionist <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 'chat' && (
          <div>
            <button
              onClick={() => setStep('form')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6"
            >
              <ArrowLeft size={15} /> Edit business info
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Meet {biz.botName} 👋</h2>
              <p className="text-gray-500 text-sm">Your AI receptionist for {biz.businessName} is live. Try asking it anything!</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
              <div className="flex items-center gap-3 px-4 py-3" style={{ background: biz.color }}>
                <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                <span className="text-white font-semibold text-sm">{biz.botName}</span>
                <span className="text-white/70 text-xs">· Online 24/7</span>
              </div>

              <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-sm rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'text-white rounded-br-sm'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                      }`}
                      style={msg.role === 'user' ? { background: biz.color } : {}}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-gray-100 bg-white">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    placeholder="Ask your receptionist anything..."
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-violet-300"
                  />
                  <button
                    onClick={() => send()}
                    disabled={loading || !input.trim()}
                    className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40"
                    style={{ background: biz.color }}
                  >
                    {loading
                      ? <Loader2 size={16} className="text-white animate-spin" />
                      : <Send size={15} className="text-white" />
                    }
                  </button>
                </div>
                <p className="text-center text-gray-400 text-xs mt-1.5">Powered by Desklo AI</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-6 text-center text-white">
              <h3 className="text-lg font-bold mb-1">Love what you see?</h3>
              <p className="text-violet-200 text-sm mb-4">
                Set up your real account and add this to your website in minutes. First 14 days free.
              </p>
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 bg-white text-violet-700 font-medium text-sm px-6 py-2.5 rounded-xl hover:bg-violet-50 transition-colors"
              >
                Create my free account <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}