import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, MessageSquare, TrendingUp, DollarSign, Eye, ArrowLeft, Loader2, Search,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const ADMIN_EMAILS = ['connorcarson222@gmail.com', 'ronanosborn8@gmail.com'];

type Customer = {
  id: string;
  name: string;
  owner_id: string;
  plan: string;
  created_at: string;
  bot_name: string;
  industry: string;
  widget_color: string;
};

type Stats = {
  totalCustomers: number;
  trialCustomers: number;
  paidCustomers: number;
  estimatedMRR: number;
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function Admin() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCustomers: 0, trialCustomers: 0, paidCustomers: 0, estimatedMRR: 0 });
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => { checkAdminAndLoad(); }, []);

  async function checkAdminAndLoad() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) { navigate('/dashboard'); return; }
      setAuthorized(true);

      const { data: businesses } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (businesses) {
        setCustomers(businesses);
        const trial = businesses.filter(b => b.plan === 'trial').length;
        const paid = businesses.filter(b => b.plan === 'starter' || b.plan === 'pro').length;
        const mrr = businesses.reduce((acc, b) => {
          if (b.plan === 'starter') return acc + 99;
          if (b.plan === 'pro') return acc + 149;
          return acc;
        }, 0);
        setStats({ totalCustomers: businesses.length, trialCustomers: trial, paidCustomers: paid, estimatedMRR: mrr });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase()) ||
    c.plan?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} color="#fff" />
      </div>
    );
  }

  if (!authorized) return null;

  const card = { background: '#131313', border: '0.5px solid #242424', borderRadius: 16, padding: 20 };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>

      {/* HEADER */}
      <header style={{ height: 56, borderBottom: '0.5px solid #242424', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', padding: isMobile ? '0 16px' : '0 24px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span aria-hidden="true" style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', fontFamily: "'Space Grotesk', sans-serif" }}>D</span>
              </div>
              {!isMobile && <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>Desklo</span>}
            </Link>
            <span style={{ fontSize: 11, fontWeight: 500, background: 'rgba(248,113,113,0.15)', color: '#f87171', padding: '2px 8px', borderRadius: 999, flexShrink: 0 }}>Admin</span>
          </div>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9A9A94', textDecoration: 'none', flexShrink: 0 }}>
            <ArrowLeft size={14} /> {!isMobile && 'Back to dashboard'}
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 24px' }}>

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(160px, 1fr))', gap: isMobile ? 10 : 12, marginBottom: isMobile ? 20 : 24 }}>
          {[
            { label: 'Total customers', value: stats.totalCustomers, icon: Users, color: '#a78bfa' },
            { label: 'Trial users', value: stats.trialCustomers, icon: TrendingUp, color: '#fbbf24' },
            { label: 'Paid customers', value: stats.paidCustomers, icon: MessageSquare, color: '#34d399' },
            { label: 'Monthly revenue', value: `$${stats.estimatedMRR}`, icon: DollarSign, color: '#9A9A94' },
          ].map((s) => (
            <div key={s.label} style={{ ...card, padding: isMobile ? 16 : 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <s.icon size={18} color={s.color} />
              </div>
              <p style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: '#fff' }}>{s.value}</p>
              <p style={{ fontSize: 11, color: '#9A9A94', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* CUSTOMERS TABLE */}
        <div style={{ background: '#131313', border: '0.5px solid #242424', borderRadius: 16 }}>
          <div style={{ padding: isMobile ? '14px 16px' : '16px 20px', borderBottom: '0.5px solid #242424', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: 12 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>All customers</h2>
            <div style={{ position: 'relative', maxWidth: isMobile ? '100%' : 240, flex: 1 }}>
              <Search size={13} color="#9A9A94" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                style={{ width: '100%', background: '#0A0A0A', border: '0.5px solid #242424', borderRadius: 8, padding: '7px 12px 7px 30px', fontSize: 12, color: '#fff', outline: 'none', boxSizing: 'border-box' as const }}
              />
            </div>
          </div>

          <div>
            {filtered.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: 13, color: '#9A9A94' }}>
                No customers yet — share your site to get signups!
              </div>
            )}
            {filtered.map((customer) => (
              <div key={customer.id} style={{ borderBottom: '0.5px solid #242424' }}>
                <div
                  onClick={() => setSelectedCustomer(selectedCustomer?.id === customer.id ? null : customer)}
                  style={{ padding: isMobile ? '12px 16px' : '14px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: customer.widget_color ?? '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{customer.name?.[0]?.toUpperCase() ?? '?'}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{customer.name ?? 'Unnamed'}</span>
                      {!isMobile && <span style={{ fontSize: 11, color: '#9A9A94' }}>{customer.industry}</span>}
                    </div>
                    <p style={{ fontSize: 11, color: '#9A9A94', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Bot: {customer.bot_name} · Signed up {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 999,
                      background: customer.plan === 'pro' ? 'rgba(167,139,250,0.15)' : customer.plan === 'starter' ? 'rgba(52,211,153,0.15)' : 'rgba(251,191,36,0.15)',
                      color: customer.plan === 'pro' ? '#a78bfa' : customer.plan === 'starter' ? '#34d399' : '#fbbf24',
                    }}>
                      {customer.plan}
                    </span>
                    {!isMobile && <Eye size={14} color="#242424" />}
                  </div>
                </div>

                {selectedCustomer?.id === customer.id && (
                  <div style={{ padding: isMobile ? '14px 16px' : '16px 20px', background: '#0A0A0A', borderTop: '0.5px solid #242424', display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: isMobile ? 12 : 16 }}>
                    {[
                      { label: 'Business ID', value: customer.id },
                      { label: 'Owner ID', value: customer.owner_id },
                      { label: 'Plan', value: customer.plan },
                      { label: 'Bot name', value: customer.bot_name },
                      { label: 'Industry', value: customer.industry ?? 'Not set' },
                      { label: 'Signed up', value: new Date(customer.created_at).toLocaleString() },
                    ].map((item) => (
                      <div key={item.label}>
                        <p style={{ fontSize: 11, fontWeight: 500, color: '#9A9A94', marginBottom: 4 }}>{item.label}</p>
                        <p style={{ fontSize: 11, color: '#F5F5F3', fontFamily: 'monospace', wordBreak: 'break-all' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}