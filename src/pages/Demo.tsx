import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Bot, Send, Loader2, Sparkles, Phone, Star, X, MessageCircle } from 'lucide-react';

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

function FloatingChatWidget({ biz, messages, input, setInput, send, loading, messagesEndRef }: {
  biz: BizInfo;
  messages: Message[];
  input: string;
  setInput: (v: string) => void;
  send: (text?: string) => void;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip after 2s, then auto-open chat after 4s
  useEffect(() => {
    const t1 = setTimeout(() => setShowTooltip(true), 2000);
    const t2 = setTimeout(() => { setShowTooltip(false); setOpen(true); }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>

      {/* Chat window */}
      {open && (
        <div style={{
          width: 340,
          background: '#fff',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 480,
        }}>
          {/* Header */}
          <div style={{ padding: '12px 16px', background: biz.color, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>{biz.botName}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#86efac' }} />
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Online now</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, padding: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={14} color="#fff" />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: '#f8f9fb', maxHeight: 300 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%',
                  borderRadius: msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  padding: '9px 13px',
                  fontSize: 13,
                  lineHeight: 1.5,
                  background: msg.role === 'user' ? biz.color : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#1a1a2e',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#fff', borderRadius: '14px 14px 14px 2px', padding: '10px 14px', display: 'flex', gap: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  {[0, 150, 300].map((delay) => (
                    <span key={delay} style={{ width: 6, height: 6, borderRadius: '50%', background: '#aab', display: 'inline-block', animation: 'bounce 1s infinite', animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type a message..."
              style={{ flex: 1, background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: '#1a1a2e', outline: 'none' }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{ width: 36, height: 36, borderRadius: 8, background: biz.color, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (loading || !input.trim()) ? 0.4 : 1, flexShrink: 0 }}
            >
              <Send size={14} color="#fff" />
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 10, color: '#aaa', padding: '4px 0 8px', background: '#fff' }}>Powered by Desklo</p>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && !open && (
        <div style={{
          background: '#0d1117',
          border: '1px solid #1e2a3a',
          borderRadius: 12,
          padding: '10px 16px',
          fontSize: 13,
          color: '#fff',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          animation: 'desklo-fade-in 0.3s ease forwards',
        }}
          onClick={() => { setShowTooltip(false); setOpen(true); }}
        >
          <span>Got a question? Ask me! 👋</span>
          <button
            onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
            style={{ background: 'none', border: 'none', color: '#8899aa', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 }}
          >×</button>
        </div>
      )}

      {/* Bubble button */}
      <button
        onClick={() => { setShowTooltip(false); setOpen(!open); }}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: biz.color,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? <X size={22} color="#fff" /> : <MessageCircle size={22} color="#fff" />}
      </button>
    </div>
  );
}

function FakeWebsite({ biz, onBack, messages, input, setInput, send, loading, messagesEndRef }: {
  biz: BizInfo;
  onBack: () => void;
  messages: Message[];
  input: string;
  setInput: (v: string) => void;
  send: (text?: string) => void;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) {
  const serviceList = biz.services
    ? biz.services.split(/[,\n]+/).map(s => s.trim()).filter(Boolean).slice(0, 4)
    : ['Service 1', 'Service 2', 'Service 3'];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`@keyframes desklo-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* PREVIEW BANNER */}
      <div style={{ background: '#1a1a2e', borderBottom: '2px solid #2563eb', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, position: 'sticky', top: 0, zIndex: 999 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#2563eb', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.06em' }}>EXAMPLE WEBSITE</div>
          <span style={{ fontSize: 12, color: '#8899aa' }}>This is a preview of how Desklo appears on your site — try clicking the chat bubble! 👇</span>
        </div>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#60a5fa', background: 'none', border: '0.5px solid #1e3a5f', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}
        >
          <ArrowLeft size={12} /> Edit info
        </button>
      </div>

      {/* FAKE NAV */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: biz.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 16 }}>🏠</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{biz.businessName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontSize: 13, color: '#666', cursor: 'pointer' }}>Services</span>
          <span style={{ fontSize: 13, color: '#666', cursor: 'pointer' }}>About</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: biz.color, color: '#fff', fontSize: 13, fontWeight: 500, padding: '7px 16px', borderRadius: 8, cursor: 'pointer' }}>
            <Phone size={13} /> Call Us
          </div>
        </div>
      </nav>

      {/* FAKE HERO */}
      <div style={{ background: '#fff', padding: '64px 32px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#111', marginBottom: 16, lineHeight: 1.15 }}>
            Welcome to<br /><span style={{ color: biz.color }}>{biz.businessName}</span>
          </h1>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 8, lineHeight: 1.6 }}>
            {biz.services
              ? `Providing ${biz.services.split(/[,\n]/)[0].trim().toLowerCase()} and more.`
              : 'Quality service you can trust.'}
          </p>
          {biz.hours && (
            <p style={{ fontSize: 13, color: '#888', marginBottom: 28 }}>🕐 Open {biz.hours}</p>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: biz.color, color: '#fff', fontSize: 14, fontWeight: 600, padding: '12px 28px', borderRadius: 10, cursor: 'pointer' }}>
              Get a Free Quote
            </div>
            <div style={{ background: '#f3f4f6', color: '#333', fontSize: 14, fontWeight: 500, padding: '12px 28px', borderRadius: 10, cursor: 'pointer' }}>
              Our Services
            </div>
          </div>
        </div>
      </div>

      {/* FAKE SERVICES */}
      <div style={{ padding: '48px 32px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 8, textAlign: 'center' }}>What We Offer</h2>
        <p style={{ fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 32 }}>Serving our community with quality and care</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {serviceList.map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${biz.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <span style={{ fontSize: 20 }}>✅</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAKE REVIEWS */}
      <div style={{ background: '#fff', padding: '40px 32px', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 24 }}>What Our Customers Say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { text: `${biz.businessName} was amazing! Quick response and great service.`, name: 'Sarah M.' },
              { text: 'Highly recommend. Professional, on time, and affordable.', name: 'James T.' },
              { text: 'Best in the area. Will definitely use them again!', name: 'Lisa R.' },
            ].map((r, i) => (
              <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 18, textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} color={biz.color} fill={biz.color} />)}
                </div>
                <p style={{ fontSize: 13, color: '#444', lineHeight: 1.5, marginBottom: 10 }}>"{r.text}"</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#888' }}>— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ARROW POINTING TO CHAT BUBBLE */}
      <div style={{
        position: 'fixed',
        bottom: 90,
        right: 88,
        zIndex: 998,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        pointerEvents: 'none',
      }}>
        <div style={{ background: '#1a1a2e', border: '1px solid #2563eb', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#60a5fa', fontWeight: 500, whiteSpace: 'nowrap' }}>
          Your AI receptionist lives here 👇
        </div>
        {/* Arrow curving down-right toward the bubble */}
        <svg width="50" height="36" viewBox="0 0 50 36" style={{ marginLeft: 24 }}>
          <path d="M 10 2 Q 30 2 40 30" stroke="#2563eb" strokeWidth="2" fill="none" strokeDasharray="4 2" />
          <polygon points="34,30 44,32 38,22" fill="#2563eb" />
        </svg>
      </div>

      {/* CTA BANNER AT BOTTOM */}
      <div style={{ background: '#0d1117', borderTop: '1px solid #1e2a3a', padding: '24px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 12 }}>
          Love how this looks? Add Desklo to your real website in minutes.
        </p>
        <Link
          to="/onboarding"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}
        >
          Create my free account <ArrowRight size={15} />
        </Link>
      </div>

      {/* FLOATING CHAT WIDGET */}
      <FloatingChatWidget
        biz={biz}
        messages={messages}
        input={input}
        setInput={setInput}
        send={send}
        loading={loading}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
}

export default function Demo() {
  const [step, setStep] = useState<'form' | 'preview'>('form');
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
    setStep('preview');
    window.scrollTo(0, 0);
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

  if (step === 'preview') {
    return (
      <FakeWebsite
        biz={biz}
        onBack={() => setStep('form')}
        messages={messages}
        input={input}
        setInput={setInput}
        send={send}
        loading={loading}
        messagesEndRef={messagesEndRef}
      />
    );
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
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(37,99,235,0.15)', border: '0.5px solid rgba(37,99,235,0.3)', fontSize: 11, color: '#60a5fa', marginBottom: 16 }}>
            <Sparkles size={11} /> Free Demo — No signup required
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Try your AI receptionist</h1>
          <p style={{ fontSize: 14, color: '#8899aa', lineHeight: 1.6 }}>Enter your business info and see exactly how Desklo will look on your website.</p>
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
            See how it looks on your website <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}