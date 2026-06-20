import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  ArrowRight,
  Check,
  Zap,
  Clock,
  UserPlus,
  MessageSquare,
  BarChart3,
  Moon,
  Settings,
  Globe,
  Sparkles,
  DollarSign,
  UserCheck,
} from 'lucide-react';

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav style={{ background: 'rgba(10,10,15,0.95)', borderBottom: '0.5px solid #1e2a3a', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Desklo</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="hidden md:flex">
          <a href="#features" style={{ fontSize: 13, color: '#8899aa', textDecoration: 'none' }}>Features</a>
          <a href="#pricing" style={{ fontSize: 13, color: '#8899aa', textDecoration: 'none' }}>Pricing</a>
          <Link to="/login" style={{ fontSize: 13, color: '#8899aa', textDecoration: 'none' }}>Login</Link>
          <Link to="/onboarding" style={{ fontSize: 13, fontWeight: 500, color: '#fff', background: '#2563eb', padding: '6px 14px', borderRadius: 8, textDecoration: 'none' }}>Get Started</Link>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#8899aa', cursor: 'pointer', padding: 8 }} className="md:hidden">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div style={{ borderTop: '0.5px solid #1e2a3a', background: '#0a0a0f', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a href="#features" style={{ fontSize: 13, color: '#8899aa', textDecoration: 'none' }}>Features</a>
          <a href="#pricing" style={{ fontSize: 13, color: '#8899aa', textDecoration: 'none' }}>Pricing</a>
          <Link to="/login" style={{ fontSize: 13, color: '#8899aa', textDecoration: 'none' }}>Login</Link>
          <Link to="/onboarding" style={{ fontSize: 13, color: '#60a5fa', textDecoration: 'none' }}>Get Started</Link>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section style={{ padding: '80px 24px 60px', textAlign: 'center' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(37,99,235,0.15)', border: '0.5px solid rgba(37,99,235,0.3)', fontSize: 11, color: '#60a5fa', marginBottom: 24 }}>
          <Zap size={11} /> 24/7 AI Receptionist
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, lineHeight: 1.08, color: '#fff', marginBottom: 16 }}>
          Never Miss a<br />
          <span style={{ color: '#2563eb' }}>Lead Again</span>
        </h1>
        <p style={{ fontSize: 15, color: '#8899aa', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Desklo answers every customer question, captures leads, and books appointments — around the clock, so you never lose business while you sleep.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, borderRadius: 10, textDecoration: 'none' }}>
            Get Started <ArrowRight size={16} />
          </Link>
          <Link to="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: 'transparent', color: '#cdd9e8', fontSize: 13, border: '0.5px solid #1e2a3a', borderRadius: 10, textDecoration: 'none' }}>
            Try Live Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { num: '24/7', label: 'Always online' },
    { num: '30s', label: 'Setup time' },
    { num: '$0', label: 'Missed leads' },
  ];
  return (
    <div style={{ margin: '0 24px 48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#1e2a3a', border: '0.5px solid #1e2a3a', borderRadius: 14, overflow: 'hidden' }}>
      {stats.map((s) => (
        <div key={s.num} style={{ background: '#0d1117', padding: '24px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{s.num}</div>
          <div style={{ fontSize: 11, color: '#8899aa' }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function WhyUs() {
  const benefits = [
    { icon: Clock, title: 'Always available, never tired', desc: 'While your competitors go to sleep, Desklo keeps working — answering questions and capturing leads at 3am just as well as 3pm.' },
    { icon: DollarSign, title: 'Cheaper than hiring staff', desc: 'A part-time receptionist costs $1,500+/month. Desklo gives you 24/7 coverage for $99/month — saving you over $1,400 every month.' },
    { icon: UserCheck, title: 'Never lose a lead again', desc: '80% of customers go to a competitor if they don\'t get a response within 5 minutes. Desklo responds in seconds, every time.' },
    { icon: Settings, title: 'Done-for-you setup', desc: 'No tech skills needed. We set everything up for you in under 5 minutes — just tell us about your business and you\'re live.' },
  ];
  return (
    <section style={{ padding: '48px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Why Desklo</p>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 32 }}>Stop losing customers to missed messages</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {benefits.map((b) => (
            <div key={b.title} style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 12, padding: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <b.icon size={18} color="#60a5fa" />
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

function LiveDemo() {
  return (
    <section style={{ padding: '0 24px 48px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ background: '#0d1827', border: '0.5px solid #1e3a5f', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(37,99,235,0.15)', border: '0.5px solid rgba(37,99,235,0.3)', fontSize: 11, color: '#60a5fa', marginBottom: 16 }}>
            <Sparkles size={11} /> No signup required
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 10 }}>See it working for your business</h2>
          <p style={{ fontSize: 13, color: '#8899aa', marginBottom: 24, maxWidth: 420, margin: '0 auto 24px' }}>
            Enter your business name, services, and hours. Your personalized AI receptionist is live in 30 seconds.
          </p>
          <Link to="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, borderRadius: 10, textDecoration: 'none' }}>
            Try it free — no signup needed <ArrowRight size={16} />
          </Link>
          <p style={{ fontSize: 11, color: '#8899aa', marginTop: 12 }}>Works for any business type</p>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: '01', icon: UserPlus, title: 'Sign up', desc: 'Create your account in under 30 seconds. No credit card required to get started.' },
    { num: '02', icon: Settings, title: 'Train your bot in 5 minutes', desc: 'Tell us about your business, services, and hours. Our AI handles the rest.' },
    { num: '03', icon: Globe, title: 'Go live on your website', desc: 'Add a single line of code and your AI receptionist is ready to work immediately.' },
  ];
  return (
    <section id="how-it-works" style={{ padding: '48px 24px', background: '#0d1117' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>How it works</p>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 32 }}>Live in 3 simple steps</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {steps.map((s) => (
            <div key={s.num} style={{ background: '#0a0a0f', border: '0.5px solid #1e2a3a', borderRadius: 12, padding: 20 }}>
              <span style={{ fontSize: 11, color: '#2563eb', fontFamily: 'monospace', display: 'block', marginBottom: 10 }}>{s.num}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <s.icon size={16} color="#60a5fa" />
              </div>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Clock, title: '24/7 availability', desc: 'Every visitor gets an instant response, day or night.' },
    { icon: UserPlus, title: 'Lead capture', desc: 'Automatically collect names, emails, and phone numbers.' },
    { icon: MessageSquare, title: 'Chat widget', desc: 'Embed a professional chat widget on your site in minutes.' },
    { icon: BarChart3, title: 'Monthly ROI reports', desc: 'See exactly how many leads your AI generates each month.' },
    { icon: Moon, title: 'After-hours coverage', desc: 'Capture leads while you sleep — no missed inquiries.' },
    { icon: Settings, title: 'Done-for-you setup', desc: 'We handle everything so you don\'t lift a finger.' },
  ];
  return (
    <section id="features" style={{ padding: '48px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Features</p>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 32 }}>Everything you need to capture leads</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {features.map((f) => (
            <div key={f.title} style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 12, padding: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <f.icon size={16} color="#60a5fa" />
              </div>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{f.title}</h3>
              <p style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" style={{ padding: '48px 24px', background: '#0d1117' }}>
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Pricing</p>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 32, textAlign: 'center' }}>Simple, transparent pricing</h2>
        <div style={{ background: '#0a0a0f', border: '2px solid #2563eb', borderRadius: 16, padding: 32, position: 'relative' }}>
          <span style={{ position: 'absolute', top: -12, left: 24, background: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 999 }}>Most Popular</span>
          <div style={{ fontSize: 14, color: '#8899aa', marginBottom: 8 }}>Starter</div>
          <div style={{ fontSize: 40, fontWeight: 700, color: '#fff', marginBottom: 24 }}>$99<span style={{ fontSize: 14, color: '#8899aa' }}>/mo</span></div>
          <ul style={{ listStyle: 'none', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Chat widget', 'Lead capture', 'Dashboard', 'Monthly reports', 'After-hours coverage', 'Done-for-you setup'].map((f) => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#cdd9e8' }}>
                <Check size={15} color="#2563eb" /> {f}
              </li>
            ))}
          </ul>
          <Link to="/onboarding" style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, borderRadius: 10, textDecoration: 'none' }}>
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: '0.5px solid #1e2a3a', padding: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={14} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Desklo</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/privacy" style={{ fontSize: 12, color: '#8899aa', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ fontSize: 12, color: '#8899aa', textDecoration: 'none' }}>Terms of Service</Link>
          <a href="mailto:desklosupport@gmail.com" style={{ fontSize: 12, color: '#8899aa', textDecoration: 'none' }}>Contact</a>
        </div>
        <p style={{ fontSize: 12, color: '#8899aa' }}>© {new Date().getFullYear()} Desklo. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Nav />
      <Hero />
      <Stats />
      <WhyUs />
      <LiveDemo />
      <HowItWorks />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}