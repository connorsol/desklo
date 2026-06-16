import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Bot, Send, Loader2, Sparkles } from 'lucide-react';

const WORKER_URL = 'https://desklo-worker.connorcarson222.workers.dev';

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
  { label: 'Blue', value: '#2563EB' },
  { label: 'Purple', value: '#7B61FF' },
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

  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
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
    color: '#2563EB',
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
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <nav style={{ background: 'rgba(10,10,15,0.95)', borderBottom: '0.5px solid #1e2a3a', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Desklo</span>
        </Link>
        <Link to="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#60a5fa', textDecoration: 'none', fontWeight: 500 }}>
          Create real account <ArrowRight size={14} />
        </Link>
      </nav>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px' }}>
        {step === 'form' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(37,99,235,0.15)', border: '0.5px solid rgba(37,99,235,0.3)', fontSize: 11, color: '#60a5fa', marginBottom: 16 }}>
                <Sparkles size={11} /> Free Demo — No signup required
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Try your AI receptionist</h1>
              <p style={{ fontSize: 14, color: '#8899aa', lineHeight: 1.6 }}>Enter your business info and instantly chat with your own AI receptionist. Takes 30 seconds.</p>
            </div>

            <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Business name *</label>
                <input
                  value={biz.businessName}
                  onChange={(e) => setBiz({ ...biz, businessName: e.target.value })}
                  placeholder="e.g. Mike's Plumbing Co."
                  style={{ width: '100%', background: '#0a0a0f', border: '0.5px solid #1e2a3a', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Receptionist name *</label>
                <input
                  value={biz.botName}
                  onChange={(e) => setBiz({ ...biz, botName: e.target.value })}
                  placeholder="e.g. Alex, Sam, or Mike's Assistant"
                  style={{ width: '100%', background: '#0a0a0f', border: '0.5px solid #1e2a3a', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>What services do you offer?</label>
                <textarea
                  value={biz.services}
                  onChange={(e) => setBiz({ ...biz, services: e.target.value })}
                  placeholder="e.g. Drain cleaning, water heater repair, emergency callouts..."
                  rows={3}
                  style={{ width: '100%', background: '#0a0a0f', border: '0.5px solid #1e2a3a', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fff', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Business hours</label>
                <input
                  value={biz.hours}
                  onChange={(e) => setBiz({ ...biz, hours: e.target.value })}
                  placeholder="e.g. Mon–Fri 8am–6pm, Sat 9am–2pm"
                  style={{ width: '100%', background: '#0a0a0f', border: '0.5px solid #1e2a3a', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Pricing (optional)</label>
                <input
                  value={biz.pricing}
                  onChange={(e) => setBiz({ ...biz, pricing: e.target.value })}
                  placeholder="e.g. Water heater repair from $150, drain cleaning $89"
                  style={{ width: '100%', background: '#0a0a0f', border: '0.5px solid #1e2a3a', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 10 }}>Brand color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setBiz({ ...biz, color: c.value })}
                      style={{ width: 36, height: 36, borderRadius: 8, background: c.value, border: biz.color === c.value ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', transform: biz.color === c.value ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.1s' }}
                      title={c.label}
                    />
                  ))}
                  <input
                    type="color"
                    value={biz.color}
                    onChange={(e) => setBiz({ ...biz, color: e.target.value })}
                    style={{ width: 36, height: 36, borderRadius: 8, cursor: 'pointer', border: '0.5px solid #1e2a3a' }}
                    title="Custom color"
                  />
                </div>
              </div>

              <button
                onClick={startDemo}
                disabled={!biz.businessName || !biz.botName}
                style={{ width: '100%', padding: '12px', borderRadius: 10, background: biz.color, color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (!biz.businessName || !biz.botName) ? 0.4 : 1 }}
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
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#8899aa', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24 }}
            >
              <ArrowLeft size={15} /> Edit business info
            </button>

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Meet {biz.botName} 👋</h2>
              <p style={{ fontSize: 13, color: '#8899aa' }}>Your AI receptionist for {biz.businessName} is live. Try asking it anything!</p>
            </div>

            <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: biz.color }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#86efac' }} />
                <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{biz.botName}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>· Online 24/7</span>
              </div>

              <div style={{ height: 320, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, background: '#0a0a0f' }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '80%',
                      borderRadius: 14,
                      padding: '10px 14px',
                      fontSize: 13,
                      lineHeight: 1.6,
                      background: msg.role === 'user' ? biz.color : '#0d1117',
                      color: msg.role === 'user' ? '#fff' : '#cdd9e8',
                      border: msg.role === 'user' ? 'none' : '0.5px solid #1e2a3a',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 14, padding: '10px 14px', display: 'flex', gap: 4 }}>
                      {[0, 150, 300].map((delay) => (
                        <span key={delay} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8899aa', display: 'inline-block', animation: 'bounce 1s infinite', animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ padding: 12, borderTop: '0.5px solid #1e2a3a', background: '#0d1117', display: 'flex', gap: 8 }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Ask your receptionist anything..."
                  style={{ flex: 1, background: '#0a0a0f', border: '0.5px solid #1e2a3a', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fff', outline: 'none' }}
                />
                <button
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  style={{ width: 40, height: 40, borderRadius: 10, background: biz.color, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (loading || !input.trim()) ? 0.4 : 1 }}
                >
                  {loading ? <Loader2 size={16} color="#fff" /> : <Send size={15} color="#fff" />}
                </button>
              </div>
              <p style={{ textAlign: 'center', fontSize: 11, color: '#8899aa', padding: '6px 0 10px' }}>Powered by Desklo AI</p>
            </div>

            <div style={{ background: '#0d1827', border: '0.5px solid #1e3a5f', borderRadius: 16, padding: 24, textAlign: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Love what you see?</h3>
              <p style={{ fontSize: 13, color: '#8899aa', marginBottom: 20 }}>Set up your real account and add this to your website in minutes. First 14 days free.</p>
              <Link
                to="/onboarding"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}
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