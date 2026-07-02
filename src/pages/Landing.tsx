import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
} from 'lucide-react';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

function SkipLink() {
  return (
    <a href="#main-content" style={{ position: 'absolute', left: -9999, top: 0, background: '#fff', color: '#0A0A0A', padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none', zIndex: 100 }}
      onFocus={(e) => { e.currentTarget.style.left = '16px'; e.currentTarget.style.top = '16px'; }}
      onBlur={(e) => { e.currentTarget.style.left = '-9999px'; }}>
      Skip to main content
    </a>
  );
}

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <nav style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '0.5px solid #242424', position: 'sticky', top: 0, zIndex: 50 }} aria-label="Main navigation">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '18px 20px' : '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }} aria-label="Desklo home">
          <div style={{ width: 22, height: 22, borderRadius: 6, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span aria-hidden="true" style={{ fontSize: 12, fontWeight: 700, color: '#0A0A0A', fontFamily: "'Space Grotesk', sans-serif" }}>D</span>
          </div>
          <span style={{ fontSize: 17, fontWeight: 600, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>Desklo</span>
        </Link>
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href="#calculator" style={{ fontSize: 13, color: '#9A9A94', textDecoration: 'none' }}>Missed revenue</a>
            <a href="#features" style={{ fontSize: 13, color: '#9A9A94', textDecoration: 'none' }}>Features</a>
            <a href="#pricing" style={{ fontSize: 13, color: '#9A9A94', textDecoration: 'none' }}>Pricing</a>
            <a href="#faq" style={{ fontSize: 13, color: '#9A9A94', textDecoration: 'none' }}>FAQ</a>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '11px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, background: 'transparent', color: '#F5F5F3', border: '0.5px solid #3A3A3A', textDecoration: 'none' }}>Sign in</Link>
              <Link to="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', padding: '11px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, background: '#fff', color: '#0A0A0A', textDecoration: 'none' }}>Start Free Trial</Link>
            </div>
          </div>
        )}
        {isMobile && (
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#9A9A94', cursor: 'pointer', padding: 8 }} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {mobileOpen ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        )}
      </div>
      {isMobile && mobileOpen && (
        <div style={{ borderTop: '0.5px solid #242424', background: '#0A0A0A', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <a href="#calculator" onClick={() => setMobileOpen(false)} style={{ fontSize: 14, color: '#9A9A94', textDecoration: 'none' }}>Missed revenue</a>
          <a href="#features" onClick={() => setMobileOpen(false)} style={{ fontSize: 14, color: '#9A9A94', textDecoration: 'none' }}>Features</a>
          <a href="#pricing" onClick={() => setMobileOpen(false)} style={{ fontSize: 14, color: '#9A9A94', textDecoration: 'none' }}>Pricing</a>
          <a href="#faq" onClick={() => setMobileOpen(false)} style={{ fontSize: 14, color: '#9A9A94', textDecoration: 'none' }}>FAQ</a>
          <Link to="/login" onClick={() => setMobileOpen(false)} style={{ fontSize: 14, color: '#9A9A94', textDecoration: 'none' }}>Sign in</Link>
          <Link to="/onboarding" onClick={() => setMobileOpen(false)} style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#fff', color: '#0A0A0A', fontSize: 14, fontWeight: 500, borderRadius: 8, textDecoration: 'none' }}>Start Free Trial</Link>
        </div>
      )}
    </nav>
  );
}

const HERO_COLORS = [
  { label: 'Black', value: '#111827' },
  { label: 'Blue', value: '#2563EB' },
  { label: 'Purple', value: '#7B61FF' },
  { label: 'Green', value: '#059669' },
  { label: 'Red', value: '#DC2626' },
  { label: 'Orange', value: '#EA580C' },
  { label: 'Pink', value: '#DB2777' },
];

function Hero() {
  const isMobile = useIsMobile();
  const [showSite, setShowSite] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [biz, setBiz] = useState({
    businessName: 'Ace Plumbing Co.',
    botName: 'Alex',
    services: 'Drain cleaning, water heater repair, emergency callouts',
    hours: 'Mon–Fri 8am–6pm, Sat 9am–2pm',
    pricing: '',
    color: '#111827',
  });

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ block: 'nearest' });
  }, [messages]);

  useEffect(() => {
    if (!showSite) { setShowTooltip(false); return; }
    const t = setTimeout(() => { if (!widgetOpen) setShowTooltip(true); }, 3000);
    return () => clearTimeout(t);
  }, [showSite]);

  const WORKER_URL = 'https://desklo-worker.connorcarson222.workers.dev';

  async function askDesklo(userMessages: { role: 'user' | 'assistant'; content: string }[]) {
    const systemPrompt = `You are ${biz.botName}, the friendly AI receptionist for ${biz.businessName}.
Services: ${biz.services}
Hours: ${biz.hours}
Pricing: ${biz.pricing || 'Contact us for pricing'}
Keep replies to 2-3 sentences. Be warm, helpful, and professional. Never make up info not provided. If pricing is not listed say to contact us for a quote.`;

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'system', content: systemPrompt }, ...userMessages] }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "I'm having a quick issue — try again!";
  }

  async function handleSend() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    const updated = [...messages, { role: 'user' as const, content: msg }];
    setMessages(updated);
    setLoading(true);
    try {
      const reply = await askDesklo(updated);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: "Couldn't reach the server — try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  function openWidget() {
    setWidgetOpen(true);
    setShowTooltip(false);
    if (!greeted) {
      setGreeted(true);
      setMessages([{ role: 'assistant', content: `Hi there! I'm ${biz.botName}, the virtual receptionist for ${biz.businessName}. How can I help you today?` }]);
    }
  }

  function startOver() {
    setShowSite(false);
    setWidgetOpen(false);
    setGreeted(false);
    setMessages([]);
  }

  const firstService = biz.services.split(/[,\n]/)[0]?.trim().toLowerCase();
  const initial = biz.businessName.charAt(0).toUpperCase() || 'A';
  const urlSlug = biz.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'yourbusiness';

  const inputStyle = {
    width: '100%', background: '#1B1B1B', border: '0.5px solid #3A3A3A', borderRadius: 8,
    padding: '9px 12px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <section style={{ padding: isMobile ? '56px 20px 60px' : '90px 24px 70px', textAlign: 'center' }} aria-label="Introduction">
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 999, border: '0.5px solid #3A3A3A', fontSize: 12, color: '#9A9A94', marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
          AI receptionist for local service businesses
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: isMobile ? 34 : 'clamp(34px, 5.5vw, 54px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em', color: '#fff', marginBottom: 18 }}>
          Stop losing customers<br />when you can't pick up.
        </h1>
        <p style={{ fontSize: isMobile ? 15 : 17, color: '#9A9A94', maxWidth: 480, margin: '0 auto 30px', lineHeight: 1.6 }}>
          Desklo answers your website visitors instantly, day or night, and books the appointment before they call your competitor instead.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
          <Link to="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: '#fff', color: '#0A0A0A', fontSize: 13, fontWeight: 500, borderRadius: 10, textDecoration: 'none' }}>
            Start Free 7-Day Trial <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a href="#demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'transparent', color: '#F5F5F3', fontSize: 13, border: '0.5px solid #3A3A3A', borderRadius: 10, textDecoration: 'none' }}>
            Try it yourself below
          </a>
        </div>
        <p style={{ fontSize: 12, color: '#5E5E59', marginBottom: 56 }}>7 days free, then $99/mo · No contract · Cancel anytime</p>

        {/* EMBEDDED LIVE DEMO */}
        <div id="demo" style={{ background: '#131313', border: '0.5px solid #242424', borderRadius: 16, padding: 8, maxWidth: 640, margin: '0 auto', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px' }}>
            {['#3A3A3A', '#3A3A3A', '#3A3A3A'].map((c, i) => (
              <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />
            ))}
            <div style={{ marginLeft: 8, background: '#0A0A0A', border: '0.5px solid #242424', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: '#5E5E59', flex: 1, maxWidth: 220 }}>
              {showSite ? `${urlSlug}.com` : 'yourbusiness.com'}
            </div>
            {showSite && (
              <button onClick={startOver} style={{ background: 'none', border: 'none', fontSize: 11, color: '#9A9A94', cursor: 'pointer', flexShrink: 0, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <ArrowLeft size={11} /> Edit
              </button>
            )}
          </div>

          {!showSite ? (
            <div style={{ padding: '20px 24px' }}>
              <p style={{ fontSize: 13, color: '#9A9A94', marginBottom: 16 }}>Fill in a real (or made-up) business and see the widget live on a preview of your site.</p>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#9A9A94', marginBottom: 6 }}>Business name</label>
                  <input value={biz.businessName} onChange={(e) => setBiz({ ...biz, businessName: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#9A9A94', marginBottom: 6 }}>Receptionist name</label>
                  <input value={biz.botName} onChange={(e) => setBiz({ ...biz, botName: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ gridColumn: isMobile ? 'auto' : '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#9A9A94', marginBottom: 6 }}>Services</label>
                  <input value={biz.services} onChange={(e) => setBiz({ ...biz, services: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#9A9A94', marginBottom: 6 }}>Hours</label>
                  <input value={biz.hours} onChange={(e) => setBiz({ ...biz, hours: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#9A9A94', marginBottom: 6 }}>Pricing (optional)</label>
                  <input value={biz.pricing} onChange={(e) => setBiz({ ...biz, pricing: e.target.value })} placeholder="e.g. Drain cleaning $89" style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, color: '#9A9A94', marginBottom: 8 }}>Brand color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {HERO_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setBiz({ ...biz, color: c.value })}
                      title={c.label}
                      style={{ width: 30, height: 30, borderRadius: 8, background: c.value, cursor: 'pointer', border: biz.color === c.value ? '2px solid #fff' : '2px solid transparent', transform: biz.color === c.value ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.1s' }}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowSite(true)}
                disabled={!biz.businessName || !biz.botName}
                style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8, padding: '11px', background: '#fff', color: '#0A0A0A', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 10, cursor: 'pointer', opacity: (!biz.businessName || !biz.botName) ? 0.4 : 1 }}
              >
                See it on my site
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative', background: '#F5F5F3', borderRadius: '0 0 10px 10px', overflow: 'hidden', minHeight: 340 }}>
              <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#111' }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: biz.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{initial}</span>
                  {biz.businessName}
                </div>
                <div style={{ background: biz.color, color: '#fff', fontSize: 11, padding: '6px 12px', borderRadius: 6, flexShrink: 0 }}>Call us</div>
              </div>
              <div style={{ padding: '44px 24px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 8, letterSpacing: '-0.01em' }}>Welcome to {biz.businessName}</h3>
                <p style={{ fontSize: 13, color: '#666' }}>{firstService ? `Providing ${firstService} and more.` : 'Quality service you can trust.'}</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
                  <span style={{ background: biz.color, color: '#fff', fontSize: 12, padding: '9px 18px', borderRadius: 8, fontWeight: 500 }}>Get a free quote</span>
                  <span style={{ background: '#eee', color: '#333', fontSize: 12, padding: '9px 18px', borderRadius: 8, fontWeight: 500 }}>Our services</span>
                </div>
              </div>

              {/* FLOATING WIDGET — matches the real production widget.js exactly */}
              <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                {widgetOpen && (
                  <div style={{ width: isMobile ? 240 : 280, background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: biz.color, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#86efac', flexShrink: 0 }} />
                        <div>
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#fff' }}>{biz.botName}</p>
                          <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Online</p>
                        </div>
                      </div>
                      <button onClick={() => setWidgetOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', width: 20, height: 20, cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
                    </div>
                    <div style={{ background: '#f9fafb', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
                      {messages.map((m, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            maxWidth: '80%', padding: '9px 13px', borderRadius: 14, fontSize: 12, lineHeight: 1.5,
                            background: m.role === 'user' ? biz.color : '#fff',
                            color: m.role === 'user' ? '#fff' : '#1f2937',
                            border: m.role === 'user' ? 'none' : '1px solid #e5e7eb',
                          }}>
                            {m.content}
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '10px 14px', display: 'flex', gap: 4 }}>
                            {[0, 150, 300].map((d) => (
                              <span key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block', animation: 'bounce 1s infinite', animationDelay: `${d}ms` }} />
                            ))}
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: '#fff', borderTop: '1px solid #e5e7eb' }}>
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message…"
                        style={{ flex: 1, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 12px', fontSize: 12, color: '#111', outline: 'none' }}
                      />
                      <button onClick={handleSend} disabled={loading || !input.trim()} style={{ width: 32, height: 32, borderRadius: 8, background: biz.color, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (loading || !input.trim()) ? 0.4 : 1, flexShrink: 0 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                      </button>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', margin: 0, padding: '6px 0' }}>Powered by Desklo</p>
                  </div>
                )}
                {showTooltip && !widgetOpen && (
                  <div
                    onClick={openWidget}
                    style={{ background: '#131313', border: '1px solid #242424', borderRadius: 12, padding: '10px 16px', fontSize: 13, color: '#fff', whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <span>Got a question? Ask me! 👋</span>
                    <button onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }} style={{ background: 'none', border: 'none', color: '#9A9A94', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                  </div>
                )}
                <button
                  onClick={() => (widgetOpen ? setWidgetOpen(false) : openWidget())}
                  style={{ width: 52, height: 52, borderRadius: '50%', background: biz.color, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
                >
                  {widgetOpen ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
function MissedRevenueCalculator() {
  const isMobile = useIsMobile();
  const [missed, setMissed] = useState(10);
  const [jobValue, setJobValue] = useState(180);
  const [rate, setRate] = useState(40);

  const monthlyLost = Math.round(missed * (rate / 100) * jobValue * 4.33);
  const fmt = (n: number) => '$' + n.toLocaleString('en-US');

  const sliderStyle = {
    WebkitAppearance: 'none' as const,
    width: '100%',
    height: 3,
    background: '#3A3A3A',
    borderRadius: 2,
    outline: 'none',
    accentColor: '#fff',
  };

  return (
    <section id="calculator" style={{ padding: isMobile ? '36px 16px' : '48px 24px', background: '#131313', borderTop: '0.5px solid #242424', borderBottom: '0.5px solid #242424' }} aria-labelledby="calc-heading">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: isMobile ? 'left' : 'center', marginBottom: 32, maxWidth: isMobile ? '100%' : 600, marginLeft: isMobile ? 0 : 'auto', marginRight: isMobile ? 0 : 'auto' }}>
          <p style={{ fontSize: 11, color: '#9A9A94', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>The cost of doing nothing</p>
          <h2 id="calc-heading" style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#fff', marginBottom: 10 }}>See what missed messages are actually costing you</h2>
          <p style={{ fontSize: isMobile ? 13 : 14, color: '#9A9A94', lineHeight: 1.7 }}>Move the sliders to match your business. This is roughly what's slipping through the cracks every month.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: isMobile ? 28 : 48, alignItems: 'start' }}>
          <div>
            <div style={{ marginBottom: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: '#9A9A94' }}>Missed inquiries per week</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{missed}</span>
              </div>
              <input type="range" min={1} max={40} step={1} value={missed} onChange={(e) => setMissed(Number(e.target.value))} style={sliderStyle} aria-label="Missed inquiries per week" />
            </div>
            <div style={{ marginBottom: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: '#9A9A94' }}>Average job value</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{fmt(jobValue)}</span>
              </div>
              <input type="range" min={30} max={1000} step={10} value={jobValue} onChange={(e) => setJobValue(Number(e.target.value))} style={sliderStyle} aria-label="Average job value" />
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: '#9A9A94' }}>Of those, how many would've booked</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{rate}%</span>
              </div>
              <input type="range" min={10} max={90} step={5} value={rate} onChange={(e) => setRate(Number(e.target.value))} style={sliderStyle} aria-label="Estimated booking rate" />
            </div>
          </div>

          <div style={{ background: '#0A0A0A', border: '0.5px solid #3A3A3A', borderRadius: 14, padding: isMobile ? 24 : 32 }}>
            <p style={{ fontSize: 13, color: '#9A9A94', marginBottom: 8 }}>Estimated revenue lost per month</p>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: isMobile ? 36 : 44, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 8 }}>{fmt(monthlyLost)}</div>
            <p style={{ fontSize: 12, color: '#5E5E59', marginBottom: 24 }}>Based on 62% of visitors never returning after an unanswered message.</p>
            <Link to="/onboarding" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 20px', background: '#fff', color: '#0A0A0A', fontSize: 13, fontWeight: 500, borderRadius: 10, textDecoration: 'none' }}>
              Start recovering it — free for 7 days <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <p style={{ fontSize: 11, color: '#5E5E59', textAlign: 'center', marginTop: 12 }}>Estimate only, based on industry response-time studies.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const isMobile = useIsMobile();
  const items = [
    { icon: Clock, title: 'Always answering', desc: 'Nights, weekends, holidays — every visitor gets a reply in seconds, not a voicemail.' },
    { icon: Check, title: 'Books the visit', desc: 'Desklo checks your hours and emails you the moment a visitor books, so nothing waits on you to notice.' },
    { icon: ArrowRight, title: 'Set up in minutes', desc: 'Tell it what you offer and what you charge. No developer, no integration work.' },
  ];
  return (
    <section id="features" style={{ padding: isMobile ? '36px 16px' : '48px 24px' }} aria-labelledby="features-heading">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#9A9A94', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>How it works</p>
        <h2 id="features-heading" style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#fff', marginBottom: 10 }}>One chat widget. Every question answered.</h2>
        <p style={{ fontSize: 14, color: '#9A9A94', marginBottom: 28, maxWidth: 520 }}>Desklo learns your services, hours, and pricing, then handles the conversation from first hello to booked appointment.</p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 1, background: '#242424', border: '0.5px solid #242424', borderRadius: 14, overflow: 'hidden' }}>
          {items.map((item) => (
            <div key={item.title} style={{ background: '#0A0A0A', padding: 28 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: '#1B1B1B', border: '0.5px solid #3A3A3A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <item.icon size={17} color="#fff" aria-hidden="true" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: '#9A9A94', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Pricing() {
  const isMobile = useIsMobile();
  return (
    <section id="pricing" style={{ padding: isMobile ? '36px 16px' : '48px 24px', background: '#131313' }} aria-labelledby="pricing-heading">
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#9A9A94', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Pricing</p>
        <h2 id="pricing-heading" style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#fff', marginBottom: 32, textAlign: 'center' }}>Simple, transparent pricing</h2>
        <div style={{ background: '#0A0A0A', border: '0.5px solid #3A3A3A', borderRadius: 16, padding: isMobile ? 24 : 32, position: 'relative' }}>
          <span style={{ position: 'absolute', top: -12, left: 24, background: '#fff', color: '#0A0A0A', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 999 }}>Most Popular</span>
          <div style={{ fontSize: 14, color: '#9A9A94', marginBottom: 8 }}>Starter</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 700, color: '#fff', marginBottom: 24 }}>$99<span style={{ fontSize: 14, color: '#9A9A94' }}>/mo</span></div>
          <ul style={{ listStyle: 'none', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Chat widget', 'Lead capture', 'Dashboard', 'Monthly reports', 'After-hours coverage', 'Done-for-you setup'].map((f) => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#F5F5F3' }}>
                <Check size={15} color="#fff" aria-hidden="true" /> {f}
              </li>
            ))}
          </ul>
          <Link to="/onboarding" style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#fff', color: '#0A0A0A', fontSize: 13, fontWeight: 500, borderRadius: 10, textDecoration: 'none' }}>
            Start Free 7-Day Trial
          </Link>
          <p style={{ fontSize: 11, color: '#9A9A94', textAlign: 'center', marginTop: 12 }}>7 days free, then $99/mo · No contract · Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const isMobile = useIsMobile();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: 'Is there a contract?', a: "No contract. Start with a 7-day free trial, then it's $99/month. Cancel anytime from your dashboard." },
    { q: 'Do I need a developer to set this up?', a: 'No. You describe your business in plain language during onboarding and Desklo handles the rest.' },
    { q: 'What happens after the free trial?', a: 'If you keep using Desklo, your card is charged $99 on day 8. You can cancel anytime before that with nothing charged.' },
    { q: 'Can it actually book appointments, not just chat?', a: 'Yes. Desklo checks the hours and services you provide, books the visit, and emails you the moment it happens.' },
  ];
  return (
    <section id="faq" style={{ padding: isMobile ? '56px 20px' : '96px 32px' }} aria-labelledby="faq-heading">
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ maxWidth: 600, marginBottom: isMobile ? 32 : 52 }}>
          <p style={{ fontSize: 13, color: '#9A9A94', fontWeight: 500, marginBottom: 12, letterSpacing: '0.02em', textTransform: 'uppercase' as const }}>FAQ</p>
          <h2 id="faq-heading" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em', fontSize: isMobile ? 28 : 38, lineHeight: 1.1, fontWeight: 600, color: '#fff' }}>Questions, answered.</h2>
        </div>
        <div>
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} style={{ borderBottom: '0.5px solid #242424', padding: '22px 0' }}>
                <button onClick={() => setOpenIndex(isOpen ? null : i)} aria-expanded={isOpen}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' as const, padding: 0 }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>{item.q}</span>
                  <span aria-hidden="true" style={{ flexShrink: 0, fontSize: 20, color: '#9A9A94', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>+</span>
                </button>
                {isOpen && (
                  <div style={{ paddingTop: 14, maxWidth: 600 }}>
                    <p style={{ fontSize: 14, color: '#9A9A94', lineHeight: 1.7 }}>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const isMobile = useIsMobile();
  return (
    <footer style={{ borderTop: '0.5px solid #242424', padding: isMobile ? '40px 20px' : '56px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span aria-hidden="true" style={{ fontSize: 12, fontWeight: 700, color: '#0A0A0A', fontFamily: "'Space Grotesk', sans-serif" }}>D</span>
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>Desklo</span>
          </div>
          <p style={{ fontSize: 13, color: '#9A9A94', maxWidth: 260, lineHeight: 1.6 }}>Never miss a lead again. A 24/7 AI receptionist for local service businesses.</p>
        </div>
        <div style={{ display: 'flex', gap: 56 }}>
          <div>
            <h4 style={{ fontSize: 11, color: '#5E5E59', marginBottom: 14, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>Product</h4>
            <a href="#features" style={{ display: 'block', fontSize: 13, color: '#9A9A94', textDecoration: 'none', marginBottom: 10 }}>Features</a>
            <a href="#pricing" style={{ display: 'block', fontSize: 13, color: '#9A9A94', textDecoration: 'none', marginBottom: 10 }}>Pricing</a>
            <a href="#calculator" style={{ display: 'block', fontSize: 13, color: '#9A9A94', textDecoration: 'none' }}>Calculator</a>
          </div>
          <div>
            <h4 style={{ fontSize: 11, color: '#5E5E59', marginBottom: 14, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>Company</h4>
            <a href="https://mail.google.com/mail/?view=cm&to=desklosupport@gmail.com" target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: 13, color: '#9A9A94', textDecoration: 'none', marginBottom: 10 }}>Contact</a>
            <Link to="/terms" style={{ display: 'block', fontSize: 13, color: '#9A9A94', textDecoration: 'none', marginBottom: 10 }}>Terms</Link>
            <Link to="/privacy" style={{ display: 'block', fontSize: 13, color: '#9A9A94', textDecoration: 'none' }}>Privacy</Link>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '32px auto 0', paddingTop: 20, borderTop: '0.5px solid #242424', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 8, alignItems: isMobile ? 'flex-start' : 'center' }}>
        <p style={{ fontSize: 12, color: '#5E5E59' }}>© {new Date().getFullYear()} Desklo. All rights reserved.</p>
        <p style={{ fontSize: 12, color: '#5E5E59' }}>Need help? <a href="mailto:desklosupport@gmail.com" style={{ color: '#9A9A94', textDecoration: 'none' }}>desklosupport@gmail.com</a></p>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <SkipLink />
      <Nav />
      <main id="main-content">
        <Hero />
        <MissedRevenueCalculator />
        <Features />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}