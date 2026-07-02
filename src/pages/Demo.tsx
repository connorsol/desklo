import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Bot, Send, Sparkles, Phone, Star, X, MessageCircle } from 'lucide-react';

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
  { label: 'Black', value: '#111827' },
  { label: 'Blue', value: '#2563EB' },
  { label: 'Purple', value: '#7B61FF' },
  { label: 'Green', value: '#059669' },
  { label: 'Red', value: '#DC2626' },
  { label: 'Orange', value: '#EA580C' },
  { label: 'Pink', value: '#DB2777' },
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
  const isMobile = window.innerWidth < 500;

  useEffect(() => {
    const t1 = setTimeout(() => setShowTooltip(true), 2000);
    const t2 = !isMobile ? setTimeout(() => { setShowTooltip(false); setOpen(true); }, 4000) : null;
    return () => { clearTimeout(t1); if (t2) clearTimeout(t2); };
  }, []);

  const chatWidth = isMobile ? Math.min(window.innerWidth - 32, 320) : 340;

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
      {open && (
        <div style={{ width: chatWidth, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', maxHeight: isMobile ? 360 : 480 }}>
          <div style={{ padding: '10px 14px', background: biz.color, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={14} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: 0 }}>{biz.botName}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#86efac' }} />
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Online now</p>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, padding: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={13} color="#fff" />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: '#f8f9fb', maxHeight: isMobile ? 220 : 300 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '82%', borderRadius: msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px', padding: '8px 11px', fontSize: 12, lineHeight: 1.5, background: msg.role === 'user' ? biz.color : '#fff', color: msg.role === 'user' ? '#fff' : '#1a1a2e', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#fff', borderRadius: '14px 14px 14px 2px', padding: '8px 12px', display: 'flex', gap: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  {[0, 150, 300].map((delay) => (
                    <span key={delay} style={{ width: 5, height: 5, borderRadius: '50%', background: '#aab', display: 'inline-block', animation: 'bounce 1s infinite', animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '8px 10px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', gap: 6 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type a message..." style={{ flex: 1, background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#1a1a2e', outline: 'none' }} />
            <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 32, height: 32, borderRadius: 8, background: biz.color, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (loading || !input.trim()) ? 0.4 : 1, flexShrink: 0 }}>
              <Send size={13} color="#fff" />
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 10, color: '#aaa', padding: '3px 0 6px', background: '#fff' }}>Powered by Desklo</p>
        </div>
      )}

      {showTooltip && !open && (
        <div style={{ background: '#131313', border: '1px solid #242424', borderRadius: 12, padding: '8px 12px', fontSize: 12, color: '#fff', whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, animation: 'desklo-fade-in 0.3s ease forwards' }}
          onClick={() => { setShowTooltip(false); setOpen(true); }}>
          <span>{isMobile ? 'Your AI receptionist lives here 👇' : 'Got a question? Ask me! 👋'}</span>
          <button onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }} style={{ background: 'none', border: 'none', color: '#8899aa', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
        </div>
      )}

      <button onClick={() => { setShowTooltip(false); setOpen(!open); }}
        style={{ width: 52, height: 52, borderRadius: '50%', background: biz.color, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.25)', transition: 'transform 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? <X size={20} color="#fff" /> : <MessageCircle size={20} color="#fff" />}
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

      {/* TOP CONVERSION BANNER */}
      <div style={{ background: 'linear-gradient(135deg, #131313, #131313)', borderBottom: '1px solid #333333', padding: '16px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: window.innerWidth < 500 ? 16 : 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
            🎉 Your personalized AI receptionist is ready.
          </p>
          <p style={{ fontSize: window.innerWidth < 500 ? 12 : 14, color: '#8899aa', marginBottom: 14, lineHeight: 1.6 }}>
            Try asking it questions just like one of your customers would.{window.innerWidth >= 500 && <><br />Everything below is exactly how it will appear on your website.</>}
          </p>
          <Link
            to="/onboarding"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0A0A0A', fontSize: window.innerWidth < 500 ? 13 : 14, fontWeight: 600, padding: window.innerWidth < 500 ? '10px 20px' : '12px 28px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.35)' }}
          >
            Create My Account <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* PREVIEW BANNER */}
      <div style={{ background: '#131313', borderBottom: '2px solid #3A3A3A', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, position: 'sticky', top: 0, zIndex: 999 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div style={{ background: '#fff', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 700, color: '#0A0A0A', letterSpacing: '0.06em', flexShrink: 0 }}>EXAMPLE</div>
          <span style={{ fontSize: 11, color: '#8899aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>This is how Desklo looks on your site 👇</span>
        </div>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#cdd9e8', background: 'none', border: '0.5px solid #3A3A3A', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={11} /> Edit
        </button>
      </div>

      {/* FAKE NAV */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 16px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: biz.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 14 }}>🏠</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{biz.businessName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: biz.color, color: '#fff', fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', flexShrink: 0 }}>
          <Phone size={12} /> Call Us
        </div>
      </nav>

      {/* FAKE HERO */}
      <div style={{ background: '#fff', padding: '64px 32px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#111', marginBottom: 16, lineHeight: 1.15 }}>
            Welcome to<br /><span style={{ color: biz.color }}>{biz.businessName}</span>
          </h1>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 8, lineHeight: 1.6 }}>
            {biz.services ? `Providing ${biz.services.split(/[,\n]/)[0].trim().toLowerCase()} and more.` : 'Quality service you can trust.'}
          </p>
          {biz.hours && <p style={{ fontSize: 13, color: '#888', marginBottom: 28 }}>🕐 Open {biz.hours}</p>}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: biz.color, color: '#fff', fontSize: 14, fontWeight: 600, padding: '12px 28px', borderRadius: 10, cursor: 'pointer' }}>Get a Free Quote</div>
            <div style={{ background: '#f3f4f6', color: '#333', fontSize: 14, fontWeight: 500, padding: '12px 28px', borderRadius: 10, cursor: 'pointer' }}>Our Services</div>
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

      {/* ARROW POINTING TO CHAT BUBBLE — desktop only */}
      {window.innerWidth >= 500 && (
        <div style={{ position: 'fixed', bottom: 90, right: 88, zIndex: 998, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, pointerEvents: 'none' }}>
          <div style={{ background: '#131313', border: '1px solid #3A3A3A', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#fff', fontWeight: 500, whiteSpace: 'nowrap' }}>
            Your AI receptionist lives here 👇
          </div>
          <svg width="50" height="36" viewBox="0 0 50 36" style={{ marginLeft: 24 }}>
            <path d="M 10 2 Q 30 2 40 30" stroke="#fff" strokeWidth="2" fill="none" strokeDasharray="4 2" />
            <polygon points="34,30 44,32 38,22" fill="#fff" />
          </svg>
        </div>
      )}

      {/* BOTTOM CTA */}
      <div style={{ background: '#131313', borderTop: '1px solid #242424', padding: '24px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 12 }}>Love how this looks? Add Desklo to your real website in minutes.</p>
        <Link to="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0A0A0A', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
          Create my free account <ArrowRight size={15} />
        </Link>
      </div>

      <FloatingChatWidget biz={biz} messages={messages} input={input} setInput={setInput} send={send} loading={loading} messagesEndRef={messagesEndRef} />
    </div>
  );
}

export default function Demo() {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [biz, setBiz] = useState<BizInfo>({ businessName: '', botName: '', services: '', hours: '', pricing: '', color: '#111827' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ block: 'nearest' });
  }, [messages]);

  function startDemo() {
    if (!biz.businessName || !biz.botName) return;
    setMessages([{ role: 'assistant', content: `Hi there! 👋 I'm ${biz.botName}, the virtual receptionist for ${biz.businessName}. How can I help you today?` }]);
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
    return <FakeWebsite biz={biz} onBack={() => setStep('form')} messages={messages} input={input} setInput={setInput} send={send} loading={loading} messagesEndRef={messagesEndRef} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <nav style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '0.5px solid #242424', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={16} color="#0A0A0A" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Desklo</span>
        </Link>
        <Link to="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#fff', textDecoration: 'none', fontWeight: 500 }}>
          Create real account <ArrowRight size={14} />
        </Link>
      </nav>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '0.5px solid #3A3A3A', fontSize: 11, color: '#cdd9e8', marginBottom: 16 }}>
            <Sparkles size={11} /> Free Demo — No signup required
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Try your AI receptionist</h1>
          <p style={{ fontSize: 14, color: '#8899aa', lineHeight: 1.6 }}>Enter your business info and see exactly how Desklo will look on your website.</p>
        </div>

        <div style={{ background: '#131313', border: '0.5px solid #242424', borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Business name *</label>
            <input value={biz.businessName} onChange={(e) => setBiz({ ...biz, businessName: e.target.value })} placeholder="e.g. Mike's Plumbing Co." style={{ width: '100%', background: '#0A0A0A', border: '0.5px solid #242424', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' as const }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Receptionist name *</label>
            <input value={biz.botName} onChange={(e) => setBiz({ ...biz, botName: e.target.value })} placeholder="e.g. Alex, Sam, or Mike's Assistant" style={{ width: '100%', background: '#0A0A0A', border: '0.5px solid #242424', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' as const }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>What services do you offer?</label>
            <textarea value={biz.services} onChange={(e) => setBiz({ ...biz, services: e.target.value })} placeholder="e.g. Drain cleaning, water heater repair, emergency callouts..." rows={3} style={{ width: '100%', background: '#0A0A0A', border: '0.5px solid #242424', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fff', outline: 'none', resize: 'none' as const, boxSizing: 'border-box' as const }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Business hours</label>
            <input value={biz.hours} onChange={(e) => setBiz({ ...biz, hours: e.target.value })} placeholder="e.g. Mon–Fri 8am–6pm, Sat 9am–2pm" style={{ width: '100%', background: '#0A0A0A', border: '0.5px solid #242424', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' as const }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Pricing (optional)</label>
            <input value={biz.pricing} onChange={(e) => setBiz({ ...biz, pricing: e.target.value })} placeholder="e.g. Water heater repair from $150, drain cleaning $89" style={{ width: '100%', background: '#0A0A0A', border: '0.5px solid #242424', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' as const }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 10 }}>Brand color</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLORS.map((c) => (
                <button key={c.value} onClick={() => setBiz({ ...biz, color: c.value })} style={{ width: 36, height: 36, borderRadius: 8, background: c.value, border: biz.color === c.value ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', transform: biz.color === c.value ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.1s' }} title={c.label} />
              ))}
              <input type="color" value={biz.color} onChange={(e) => setBiz({ ...biz, color: e.target.value })} style={{ width: 36, height: 36, borderRadius: 8, cursor: 'pointer', border: '0.5px solid #242424' }} title="Custom color" />
            </div>
          </div>
          <button onClick={startDemo} disabled={!biz.businessName || !biz.botName} style={{ width: '100%', padding: '12px', borderRadius: 10, background: biz.color, color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (!biz.businessName || !biz.botName) ? 0.4 : 1 }}>
            See how it looks on your website <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}