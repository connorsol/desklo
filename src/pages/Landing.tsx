import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  ArrowRight,
  Check,
  Zap,
  Clock,
  Sparkles,
  DollarSign,
  UserCheck,
  Settings,
  Star,
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
    <a href="#main-content" style={{ position: 'absolute', left: -9999, top: 0, background: '#2563eb', color: '#fff', padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none', zIndex: 100 }}
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
    <nav style={{ background: 'rgba(10,10,15,0.95)', borderBottom: '0.5px solid #1e2a3a', position: 'sticky', top: 0, zIndex: 50 }} aria-label="Main navigation">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }} aria-label="Desklo home">
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bot size={16} color="#fff" aria-hidden="true" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Desklo</span>
        </Link>
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#pricing" style={{ fontSize: 13, color: '#8899aa', textDecoration: 'none' }}>Pricing</a>
            <Link to="/login" style={{ fontSize: 13, color: '#8899aa', textDecoration: 'none' }}>Login</Link>
            <Link to="/onboarding" style={{ fontSize: 13, fontWeight: 500, color: '#fff', background: '#2563eb', padding: '6px 14px', borderRadius: 8, textDecoration: 'none' }}>Get Started</Link>
          </div>
        )}
        {isMobile && (
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#8899aa', cursor: 'pointer', padding: 8 }} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {mobileOpen ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        )}
      </div>
      {isMobile && mobileOpen && (
        <div style={{ borderTop: '0.5px solid #1e2a3a', background: '#0a0a0f', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <a href="#pricing" onClick={() => setMobileOpen(false)} style={{ fontSize: 14, color: '#8899aa', textDecoration: 'none' }}>Pricing</a>
          <Link to="/login" onClick={() => setMobileOpen(false)} style={{ fontSize: 14, color: '#8899aa', textDecoration: 'none' }}>Login</Link>
          <Link to="/onboarding" onClick={() => setMobileOpen(false)} style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 500, borderRadius: 8, textDecoration: 'none' }}>Get Started</Link>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? '56px 20px 40px' : '80px 24px 60px', textAlign: 'center' }} aria-label="Introduction">
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(37,99,235,0.15)', border: '0.5px solid rgba(37,99,235,0.3)', fontSize: 11, color: '#60a5fa', marginBottom: 24 }}>
          <Zap size={11} aria-hidden="true" /> 24/7 AI Receptionist
        </div>
        <h1 style={{ fontSize: isMobile ? 36 : 'clamp(36px, 6vw, 56px)', fontWeight: 700, lineHeight: 1.1, color: '#fff', marginBottom: 16 }}>
          Never Miss a<br /><span style={{ color: '#2563eb' }}>Lead Again</span>
        </h1>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 999, background: 'rgba(52,211,153,0.1)', border: '0.5px solid rgba(52,211,153,0.2)', fontSize: 12, color: '#34d399', marginBottom: 16 }}>
          ✓ Join 100+ businesses using Desklo
        </div>
        <p style={{ fontSize: isMobile ? 14 : 15, color: '#8899aa', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Desklo answers every customer question, captures leads, and books appointments — around the clock, so you don't have to.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, borderRadius: 10, textDecoration: 'none' }}>
            Get Started <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link to="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'transparent', color: '#cdd9e8', fontSize: 13, border: '0.5px solid #1e2a3a', borderRadius: 10, textDecoration: 'none' }}>
            Try Live Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const isMobile = useIsMobile();
  const stats = [
    { num: '24/7', label: 'Always online' },
    { num: '30s', label: 'Setup time' },
    { num: '$0', label: 'Missed leads' },
  ];
  return (
    <div style={{ margin: isMobile ? '0 16px 40px' : '0 24px 48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#1e2a3a', border: '0.5px solid #1e2a3a', borderRadius: 14, overflow: 'hidden' }} role="list" aria-label="Key stats">
      {stats.map((s) => (
        <div key={s.num} style={{ background: '#0d1117', padding: isMobile ? '18px 8px' : '24px 16px', textAlign: 'center' }} role="listitem">
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{s.num}</div>
          <div style={{ fontSize: isMobile ? 10 : 11, color: '#8899aa' }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function LiveDemo() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? '0 16px 40px' : '0 24px 48px' }} aria-labelledby="live-demo-heading">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ background: '#0d1827', border: '0.5px solid #1e3a5f', borderRadius: 16, padding: isMobile ? '28px 20px' : '40px 32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(37,99,235,0.15)', border: '0.5px solid rgba(37,99,235,0.3)', fontSize: 11, color: '#60a5fa', marginBottom: 16 }}>
            <Sparkles size={11} aria-hidden="true" /> No signup required
          </div>
          <h2 id="live-demo-heading" style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: '#fff', marginBottom: 10 }}>See it working for your business</h2>
          <p style={{ fontSize: 13, color: '#8899aa', marginBottom: 24, maxWidth: 420, margin: '0 auto 24px' }}>
            Enter your business name, services, and hours. Your personalized AI receptionist is live in 30 seconds.
          </p>
          <Link to="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, borderRadius: 10, textDecoration: 'none' }}>
            Try it free — no signup needed <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <p style={{ fontSize: 11, color: '#8899aa', marginTop: 12 }}>Works for any business type</p>
        </div>
      </div>
    </section>
  );
}

function CostOfInaction() {
  const isMobile = useIsMobile();
  const stats = [
    { num: '62%', label: 'of visitors leave and never return', desc: "When a website visitor can't get an instant answer to their question, more than half leave and go to a competitor who responds immediately." },
    { num: '$200+', label: 'lost per unanswered message', desc: 'The average unanswered website inquiry costs a small business over $200 in lost revenue — and most businesses miss dozens every month.' },
    { num: '$75K', label: 'lost per year after hours', desc: 'Small businesses lose an estimated $75,000+ annually to website visitors who came after hours, got no response, and moved on.' },
  ];
  return (
    <section style={{ padding: isMobile ? '36px 16px' : '48px 24px', background: '#0a0a0f' }} aria-labelledby="cost-heading">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>The cost of doing nothing</p>
          <h2 id="cost-heading" style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Right now, your website is losing you money</h2>
          <p style={{ fontSize: isMobile ? 13 : 14, color: '#8899aa', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>Every hour your website sits without a live chat, potential customers are leaving and going to competitors who respond instantly.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
          {stats.map((s) => (
            <div key={s.num} style={{ background: 'rgba(239,68,68,0.04)', border: '0.5px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? 36 : 44, fontWeight: 800, color: '#ef4444', marginBottom: 6, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{s.label}</div>
              <p style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Link to="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, borderRadius: 10, textDecoration: 'none' }}>
            Stop losing customers tonight <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const isMobile = useIsMobile();
  const testimonials = [
    { name: 'Mike R.', business: "Mike's Plumbing Co.", location: 'Austin, TX', text: 'I was losing customers every night because nobody was answering after 5pm. Desklo fixed that completely. It booked 3 jobs in the first week while I was asleep.', stars: 5 },
    { name: 'Sarah K.', business: 'Bloom Hair Studio', location: 'Denver, CO', text: "My clients love being able to book appointments at midnight. I've had zero missed leads since installing Desklo. Honestly the best $99 I spend every month.", stars: 5 },
    { name: 'Dr. James T.', business: 'Riverside Dental', location: 'Phoenix, AZ', text: 'Set it up in literally 2 minutes. The AI knows everything about our services and handles patient questions better than I expected. Highly recommend.', stars: 5 },
  ];
  return (
    <section style={{ padding: isMobile ? '36px 16px' : '48px 24px' }} aria-labelledby="testimonials-heading">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Testimonials</p>
        <h2 id="testimonials-heading" style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#fff', marginBottom: 24 }}>Small businesses love Desklo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
          {testimonials.map((t) => (
            <div key={t.name} style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(t.stars)].map((_, i) => (<Star key={i} size={13} color="#fbbf24" fill="#fbbf24" aria-hidden="true" />))}
              </div>
              <p style={{ fontSize: 13, color: '#cdd9e8', lineHeight: 1.7, flex: 1 }}>"{t.text}"</p>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{t.name}</p>
                <p style={{ fontSize: 11, color: '#8899aa' }}>{t.business} · {t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const isMobile = useIsMobile();
  const benefits = [
    { icon: Clock, title: 'Always available, never tired', desc: 'While your competitors go to sleep, Desklo keeps working — answering questions and capturing leads at 3am just as well as 3pm.' },
    { icon: DollarSign, title: 'Cheaper than hiring staff', desc: 'A part-time receptionist costs $1,500+/month. Desklo gives you 24/7 coverage for $99/month — saving you over $1,400 every month.' },
    { icon: UserCheck, title: 'Never lose a lead again', desc: "80% of customers go to a competitor if they don't get a response within 5 minutes. Desklo responds in seconds, every time." },
    { icon: Settings, title: 'Done-for-you setup', desc: "No tech skills needed. We set everything up for you in under 5 minutes — just tell us about your business and you're live." },
  ];
  return (
    <section style={{ padding: isMobile ? '36px 16px' : '48px 24px' }} aria-labelledby="why-us-heading">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Why Desklo</p>
        <h2 id="why-us-heading" style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#fff', marginBottom: 24 }}>Stop losing customers to missed messages</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {benefits.map((b) => (
            <div key={b.title} style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 12, padding: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <b.icon size={18} color="#60a5fa" aria-hidden="true" />
              </div>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{b.title}</h3>
              <p style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmailPreview() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? '36px 16px' : '48px 24px' }} aria-labelledby="email-preview-heading">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>What you receive</p>
        <h2 id="email-preview-heading" style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Every lead lands straight in your inbox</h2>
        <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 32, maxWidth: 520 }}>When a customer books through your AI receptionist, you instantly receive a full contact card with everything you need to follow up.</p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <img src="/appointment-email.png" alt="Appointment email example" style={{ width: '100%', borderRadius: 16, border: '0.5px solid #1e2a3a', boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: '👤', title: 'Full customer details', desc: 'Name, phone, email, and home address — everything you need to confirm the appointment.' },
              { icon: '📅', title: 'Service and timing', desc: 'Exactly what service they want and their preferred date and time.' },
              { icon: '⚡', title: 'Instant delivery', desc: 'The email hits your inbox the second they confirm — day or night, even while you sleep.' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,99,235,0.1)', border: '0.5px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const isMobile = useIsMobile();
  return (
    <section id="pricing" style={{ padding: isMobile ? '36px 16px' : '48px 24px', background: '#0d1117' }} aria-labelledby="pricing-heading">
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Pricing</p>
        <h2 id="pricing-heading" style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#fff', marginBottom: 32, textAlign: 'center' }}>Simple, transparent pricing</h2>
        <div style={{ background: '#0a0a0f', border: '2px solid #2563eb', borderRadius: 16, padding: isMobile ? 24 : 32, position: 'relative' }}>
          <span style={{ position: 'absolute', top: -12, left: 24, background: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 999 }}>Most Popular</span>
          <div style={{ fontSize: 14, color: '#8899aa', marginBottom: 8 }}>Starter</div>
          <div style={{ fontSize: 40, fontWeight: 700, color: '#fff', marginBottom: 24 }}>$99<span style={{ fontSize: 14, color: '#8899aa' }}>/mo</span></div>
          <ul style={{ listStyle: 'none', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Chat widget', 'Lead capture', 'Dashboard', 'Monthly reports', 'After-hours coverage', 'Done-for-you setup'].map((f) => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#cdd9e8' }}>
                <Check size={15} color="#2563eb" aria-hidden="true" /> {f}
              </li>
            ))}
          </ul>
          <Link to="/onboarding" style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, borderRadius: 10, textDecoration: 'none' }}>
            Get Started
          </Link>
          <p style={{ fontSize: 11, color: '#8899aa', textAlign: 'center', marginTop: 12 }}>No contract · Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const isMobile = useIsMobile();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    { q: 'Will it sound robotic to my customers?', a: "No — Desklo is trained on your business's actual services, hours, and pricing so it answers naturally in conversation, not with scripted responses. Try the live demo above and judge for yourself." },
    { q: 'What if it tells a customer something wrong?', a: "Desklo only answers using the information you give it. It never makes up prices, services, or availability — if it doesn't know something, it tells the customer the team will follow up, instead of guessing." },
    { q: 'Can I edit what it says?', a: 'Yes. You control your services, hours, pricing, and tone from your dashboard at any time. Changes take effect immediately, no developer needed.' },
    { q: 'Do I need to know how to code?', a: 'Not at all. Setup takes about 5 minutes — tell us about your business and we handle the rest. Adding the widget to your website is one line of code, or we can do it for you.' },
    { q: 'Is there a contract?', a: 'No contract. Desklo is $99/month, cancel anytime from your dashboard with no fees or hoops to jump through.' },
    { q: 'Does it work with my website builder?', a: 'Yes — Desklo works with Wix, WordPress, Squarespace, Shopify, and any custom site. We provide step-by-step install guides for each platform.' },
  ];
  return (
    <section style={{ padding: isMobile ? '36px 16px' : '48px 24px' }} aria-labelledby="faq-heading">
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>FAQ</p>
        <h2 id="faq-heading" style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#fff', marginBottom: 24, textAlign: 'center' }}>Common questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setOpenIndex(isOpen ? null : i)} aria-expanded={isOpen}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 18px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item.q}</span>
                  <span aria-hidden="true" style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 6, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#60a5fa', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease' }}>+</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 18px 16px' }}>
                    <p style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.7 }}>{item.a}</p>
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
    <footer style={{ borderTop: '0.5px solid #1e2a3a', padding: isMobile ? '24px 16px' : '24px' }}>
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={14} color="#fff" aria-hidden="true" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Desklo</span>
          </div>
          <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }} aria-label="Legal">
            <Link to="/privacy" style={{ fontSize: 12, color: '#8899aa', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ fontSize: 12, color: '#8899aa', textDecoration: 'none' }}>Terms of Service</Link>
            <a href="https://mail.google.com/mail/?view=cm&to=desklosupport@gmail.com" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#8899aa', textDecoration: 'none' }}>Contact</a>
          </nav>
          <p style={{ fontSize: 12, color: '#8899aa' }}>Need help? <a href="mailto:desklosupport@gmail.com" style={{ color: '#60a5fa', textDecoration: 'none' }}>desklosupport@gmail.com</a></p>
          <p style={{ fontSize: 12, color: '#8899aa' }}>© {new Date().getFullYear()} Desklo. All rights reserved.</p>
        </div>
      ) : (
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={14} color="#fff" aria-hidden="true" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Desklo</span>
            </div>
            <nav style={{ display: 'flex', gap: 20, justifySelf: 'center' }} aria-label="Legal">
              <Link to="/privacy" style={{ fontSize: 12, color: '#8899aa', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ fontSize: 12, color: '#8899aa', textDecoration: 'none' }}>Terms of Service</Link>
              <a href="https://mail.google.com/mail/?view=cm&to=desklosupport@gmail.com" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#8899aa', textDecoration: 'none' }}>Contact</a>
            </nav>
            <p style={{ fontSize: 12, color: '#8899aa', justifySelf: 'end' }}>© {new Date().getFullYear()} Desklo. All rights reserved.</p>
          </div>
          <p style={{ fontSize: 12, color: '#8899aa', textAlign: 'center' }}>Need help? <a href="mailto:desklosupport@gmail.com" style={{ color: '#60a5fa', textDecoration: 'none' }}>desklosupport@gmail.com</a></p>
        </div>
      )}
    </footer>
  );
}

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <SkipLink />
      <Nav />
      <main id="main-content">
        <Hero />
        <Stats />
        <LiveDemo />
        <CostOfInaction />
        <Testimonials />
        <WhyUs />
        <EmailPreview />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}