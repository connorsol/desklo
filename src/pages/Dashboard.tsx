import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  MessageSquare,
  UserPlus,
  Moon,
  BarChart3,
  Copy,
  Check,
  CreditCard,
  Loader2,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { ChatWidget } from '../components/ChatWidget';
import { supabase } from '../lib/supabase';
import type { Business } from '../lib/gemini';

const ADMIN_EMAILS = ['connorcarson222@gmail.com', 'ronanosborn8@gmail.com', 'iidoug2002@gmail.com'];
const WORKER_URL = 'https://desklo-worker.connorcarson222.workers.dev';

interface Conversation {
  id: string;
  channel: 'web' | 'sms';
  lead: boolean;
  time: string;
  message: string;
  name: string;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [widgetColor, setWidgetColor] = useState('#2563eb');
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>('trial');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [convoMessages, setConvoMessages] = useState<{[key: string]: {role: string, content: string}[]}>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    conversationsThisMonth: 0,
    leadsTotal: 0,
    afterHours: 0,
    allTime: 0,
  });

  const isMobile = useIsMobile();

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  async function checkAuthAndLoad() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const { data: { session: retrySession } } = await supabase.auth.getSession();
      if (!retrySession) {
        window.location.href = '/login';
        return;
      }
      await loadBusiness(retrySession.user);
      return;
    }
    await loadBusiness(session.user);
  }

  async function loadBusiness(user: any) {
    try {
      setUserName(user.email ?? '');
      setUserEmail(user.email ?? '');
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (error || !data) { setLoading(false); return; }

      const businessPlan = data.plan ?? 'trial';
      const isAdmin = ADMIN_EMAILS.includes(user.email ?? '');
      const isPaidPlan = businessPlan === 'starter' || businessPlan === 'pro';

      if (!isPaidPlan && !isAdmin) {
        setRedirecting(true);
        try {
          const res = await fetch(`${WORKER_URL}/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, businessId: data.id }),
          });
          const checkoutData = await res.json();
          if (checkoutData.url) {
            window.location.href = checkoutData.url;
            return;
          }
        } catch (err) {
          console.error('Failed to redirect to checkout:', err);
        }
        setRedirecting(false);
      }

      setBusiness({
        name: data.name,
        services: data.services ?? '',
        hours: data.hours ?? '',
        pricing: data.pricing ?? '',
        booking_info: data.booking_info ?? '',
        location: data.location ?? '',
        bot_name: data.bot_name ?? 'Assistant',
      });

      setWidgetColor(data.widget_color ?? '#2563eb');
      setBusinessId(data.id);
      setPlan(businessPlan);
      await loadConversations(data.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadConversations(bizId: string) {
    try {
      const { data } = await supabase
        .from('conversations')
        .select(`id, channel, is_lead, is_after_hours, created_at, messages(role, content)`)
        .eq('business_id', bizId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        const formatted = data.map((c: any) => {
          const firstUserMsg = c.messages?.find((m: any) => m.role === 'user');
          return {
            id: c.id,
            channel: c.channel as 'web' | 'sms',
            lead: c.is_lead,
            time: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message: firstUserMsg?.content ?? 'New conversation',
            name: 'Visitor',
          };
        });
        setConversations(formatted);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        setStats({
          conversationsThisMonth: data.filter((c: any) => new Date(c.created_at) >= startOfMonth).length,
          leadsTotal: data.filter((c: any) => c.is_lead).length,
          afterHours: data.filter((c: any) => c.is_after_hours).length,
          allTime: data.length,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadMessages(convoId: string) {
    if (selectedConvo === convoId) { setSelectedConvo(null); return; }
    if (convoMessages[convoId]) { setSelectedConvo(convoId); return; }
    try {
      const { data } = await supabase
        .from('messages')
        .select('role, content')
        .eq('conversation_id', convoId)
        .order('created_at', { ascending: true });

      if (data) {
        setConvoMessages(prev => ({ ...prev, [convoId]: data }));
        setSelectedConvo(convoId);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  async function handleManagePlan() {
    if (!businessId) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch(`${WORKER_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, businessId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutLoading(false);
      }
    } catch (err) {
      console.error(err);
      setCheckoutLoading(false);
    }
  }

  if (loading || redirecting) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Loader2 size={24} color="#2563eb" style={{ animation: 'spin 1s linear infinite' }} />
        {redirecting && <p style={{ fontSize: 13, color: '#8899aa' }}>Redirecting to checkout...</p>}
      </div>
    );
  }

  const activeBusiness: Business = business ?? {
    name: "Your Business",
    services: "Your services",
    hours: "Mon–Fri 9am–5pm",
    pricing: "Contact us for pricing",
    booking_info: "Contact us to book",
    location: "Your location",
    bot_name: "Assistant",
  };

  const statCards = [
    { label: 'Conversations This Month', value: stats.conversationsThisMonth, icon: MessageSquare },
    { label: 'Leads Captured', value: stats.leadsTotal, icon: UserPlus },
    { label: 'After-Hours', value: stats.afterHours, icon: Moon },
    { label: 'Total All Time', value: stats.allTime, icon: BarChart3 },
  ];

  const card = { background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 16 };

  const embedCode = businessId
    ? `<script>window.DESKLO_KEY = '${businessId}';</script>\n<script src="https://deskloai.com/widget.js"></script>`
    : `<script>window.DESKLO_KEY = 'loading...';</script>\n<script src="https://deskloai.com/widget.js"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isPaid = plan === 'starter' || plan === 'pro';
  const isAdmin = ADMIN_EMAILS.includes(userName);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>

      {/* HEADER */}
      <header style={{ height: 56, borderBottom: '0.5px solid #1e2a3a', background: 'rgba(10,10,15,0.95)', display: 'flex', alignItems: 'center', padding: '0 20px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Left: logo + business name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="#fff" />
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Desklo</span>
            </Link>
            {!isMobile && (
              <>
                <span style={{ color: '#1e2a3a', fontSize: 18, flexShrink: 0 }}>|</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#8899aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
                  {activeBusiness.name}
                </span>
              </>
            )}
          </div>

          {/* Desktop right nav */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 12, color: '#8899aa', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{userName}</span>
              {isAdmin && (
                <Link to="/admin" style={{ fontSize: 13, color: '#f87171', fontWeight: 500, textDecoration: 'none' }}>Admin</Link>
              )}
              <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#8899aa', textDecoration: 'none' }}>
                <Settings size={14} /> Settings
              </Link>
              <button onClick={handleSignOut} style={{ fontSize: 13, color: '#8899aa', background: 'none', border: 'none', cursor: 'pointer' }}>
                Sign out
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', color: '#8899aa', cursor: 'pointer', padding: 6 }}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </header>

      {/* Mobile dropdown menu */}
      {isMobile && mobileMenuOpen && (
        <div style={{ background: '#0d1117', borderBottom: '0.5px solid #1e2a3a', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 56, zIndex: 39 }}>
          <div style={{ fontSize: 12, color: '#8899aa' }}>{userName}</div>
          <div style={{ height: '0.5px', background: '#1e2a3a' }} />
          {isAdmin && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 14, color: '#f87171', fontWeight: 500, textDecoration: 'none' }}>Admin Panel</Link>
          )}
          <Link to="/settings" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#8899aa', textDecoration: 'none' }}>
            <Settings size={15} /> Settings
          </Link>
          <button onClick={handleSignOut} style={{ textAlign: 'left', fontSize: 14, color: '#8899aa', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Sign out
          </button>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 24px' }}>

        {/* SETUP BANNER */}
        {!business && (
          <div style={{ background: 'rgba(37,99,235,0.1)', border: '0.5px solid rgba(37,99,235,0.3)', borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#60a5fa' }}>Welcome to Desklo! 👋</p>
              <p style={{ fontSize: 13, color: '#8899aa', marginTop: 2 }}>Complete your setup to get your AI receptionist live.</p>
            </div>
            <Link to="/onboarding" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, borderRadius: 8, textDecoration: 'none', flexShrink: 0 }}>
              Complete setup →
            </Link>
          </div>
        )}

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
          {statCards.map((s) => (
            <div key={s.label} style={{ ...card, padding: isMobile ? 16 : 20 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <s.icon size={17} color="#60a5fa" />
              </div>
              <p style={{ fontSize: isMobile ? 22 : 24, fontWeight: 700, color: '#fff' }}>{s.value}</p>
              <p style={{ fontSize: isMobile ? 10 : 11, color: '#8899aa', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* MAIN GRID — stacks on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: 16 }}>

          {/* CONVERSATIONS */}
          <div style={{ ...card }}>
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #1e2a3a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Recent Conversations</h2>
              <span style={{ fontSize: 11, color: '#8899aa' }}>{conversations.length} conversations</span>
            </div>
            <div>
              {conversations.length === 0 && (
                <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: 13, color: '#8899aa' }}>
                  No conversations yet — embed the widget on your site to get started!
                </div>
              )}
              {conversations.map((c) => (
                <div key={c.id} style={{ borderBottom: '0.5px solid #1e2a3a' }}>
                  <div
                    onClick={() => loadMessages(c.id)}
                    style={{ padding: '14px 20px', display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1e2a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#8899aa' }}>V</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{c.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', padding: '2px 6px', borderRadius: 4, background: '#1e2a3a', color: '#8899aa' }}>
                          {c.channel}
                        </span>
                        {c.lead && (
                          <span style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', padding: '2px 6px', borderRadius: 4, background: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>
                            Lead
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: '#8899aa', marginLeft: 'auto' }}>{c.time}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#8899aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</p>
                    </div>
                  </div>

                  {selectedConvo === c.id && convoMessages[c.id] && (
                    <div style={{ padding: '12px 20px 16px', background: '#0a0a0f', borderTop: '0.5px solid #1e2a3a', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {convoMessages[c.id].map((msg, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            maxWidth: '75%',
                            borderRadius: 10,
                            padding: '8px 12px',
                            fontSize: 12,
                            lineHeight: 1.5,
                            background: msg.role === 'user' ? '#2563eb' : '#0d1117',
                            color: msg.role === 'user' ? '#fff' : '#cdd9e8',
                            border: msg.role === 'user' ? 'none' : '0.5px solid #1e2a3a',
                          }}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* EMBED CODE */}
            <div style={{ ...card, padding: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Embed Code</h3>
              <div style={{ position: 'relative' }}>
                <pre style={{ background: '#0a0a0f', border: '0.5px solid #1e2a3a', borderRadius: 10, padding: 14, fontSize: 11, color: '#8899aa', overflow: 'auto', fontFamily: 'monospace', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
                  {embedCode}
                </pre>
                <button
                  onClick={handleCopy}
                  style={{ position: 'absolute', top: 10, right: 10, padding: 6, borderRadius: 6, background: '#1e2a3a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {copied ? <Check size={13} color="#34d399" /> : <Copy size={13} color="#8899aa" />}
                </button>
              </div>
              <p style={{ fontSize: 11, color: '#8899aa', marginTop: 10 }}>Add this before the closing &lt;/body&gt; tag on your website.</p>
              <Link to="/install" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 12, color: '#60a5fa', textDecoration: 'none' }}>
                📖 View installation guide →
              </Link>
            </div>

            {/* PLAN */}
            <div style={{ ...card, padding: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Your Plan</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{isPaid ? 'Starter' : 'Free Trial'}</p>
                  <p style={{ fontSize: 12, color: '#8899aa' }}>{isPaid ? '$99/mo' : 'Upgrade to unlock'}</p>
                </div>
                <CreditCard size={18} color="#1e2a3a" />
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {['Chat widget', 'Lead capture', 'Dashboard', 'Monthly reports'].map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#8899aa' }}>
                    <Check size={12} color="#2563eb" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleManagePlan}
                disabled={checkoutLoading}
                style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 8, cursor: 'pointer', opacity: checkoutLoading ? 0.6 : 1 }}
              >
                {checkoutLoading ? 'Loading...' : isPaid ? 'Manage Plan' : 'Subscribe Now'}
              </button>
            </div>

            {/* TEST BOT */}
            <div style={{ ...card, padding: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 6 }}>Test Your Bot</h3>
              <p style={{ fontSize: 12, color: '#8899aa', marginBottom: 12 }}>Click the chat bubble to test your AI receptionist live.</p>
              <div style={{ background: 'rgba(37,99,235,0.1)', border: '0.5px solid rgba(37,99,235,0.3)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }} />
                <span style={{ fontSize: 12, color: '#60a5fa', fontWeight: 500 }}>{activeBusiness.bot_name} is online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatWidget business={activeBusiness} color={widgetColor} businessId={businessId ?? undefined} />
    </div>
  );
}