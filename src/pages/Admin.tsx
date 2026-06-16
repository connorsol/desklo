import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bot, Users, MessageSquare, TrendingUp, DollarSign, Eye, ArrowLeft, Loader2, Search,
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

export default function Admin() {
  const navigate = useNavigate();
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
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} color="#2563eb" />
      </div>
    );
  }

  if (!authorized) return null;

  const card = { background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 16, padding: 20 };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>

      {/* HEADER */}
      <header style={{ height: 56, borderBottom: '0.5px solid #1e2a3a', background: 'rgba(10,10,15,0.95)', display: 'flex', alignItems: 'center', padding: '0 24px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="#fff" />
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Desklo</span>
            </Link>
            <span style={{ fontSize: 11, fontWeight: 500, background: 'rgba(248,113,113,0.15)', color: '#f87171', padding: '2px 8px', borderRadius: 999 }}>Admin</span>
          </div>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#8899aa', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to dashboard
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total customers', value: stats.totalCustomers, icon: Users, color: '#a78bfa' },
            { label: 'Trial users', value: stats.trialCustomers, icon: TrendingUp, color: '#fbbf24' },
            { label: 'Paid customers', value: stats.paidCustomers, icon: MessageSquare, color: '#34d399' },
            { label: 'Monthly revenue', value: `$${stats.estimatedMRR}`, icon: DollarSign, color: '#60a5fa' },
          ].map((s) => (
            <div key={s.label} style={card}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <s.icon size={18} color={s.color} />
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{s.value}</p>
              <p style={{ fontSize: 11, color: '#8899aa', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* CUSTOMERS TABLE */}
        <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 16 }}>
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #1e2a3a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>All customers</h2>
            <div style={{ position: 'relative', maxWidth: 240, flex: 1 }}>
              <Search size={13} color="#8899aa" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                style={{ width: '100%', background: '#0a0a0f', border: '0.5px solid #1e2a3a', borderRadius: 8, padding: '7px 12px 7px 30px', fontSize: 12, color: '#fff', outline: 'none', boxSizing: 'border-box' as const }}
              />
            </div>
          </div>

          <div>
            {filtered.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: 13, color: '#8899aa' }}>
                No customers yet — share your site to get signups!
              </div>
            )}
            {filtered.map((customer) => (
              <div key={customer.id} style={{ borderBottom: '0.5px solid #1e2a3a' }}>
                <div
                  onClick={() => setSelectedCustomer(selectedCustomer?.id === customer.id ? null : customer)}
                  style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: customer.widget_color ?? '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{customer.name?.[0]?.toUpperCase() ?? '?'}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{customer.name ?? 'Unnamed'}</span>
                      <span style={{ fontSize: 11, color: '#8899aa' }}>{customer.industry}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#8899aa' }}>
                      Bot: {customer.bot_name} · Signed up {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 999,
                      background: customer.plan === 'pro' ? 'rgba(167,139,250,0.15)' : customer.plan === 'starter' ? 'rgba(52,211,153,0.15)' : 'rgba(251,191,36,0.15)',
                      color: customer.plan === 'pro' ? '#a78bfa' : customer.plan === 'starter' ? '#34d399' : '#fbbf24',
                    }}>
                      {customer.plan}
                    </span>
                    <Eye size={14} color="#1e2a3a" />
                  </div>
                </div>

                {selectedCustomer?.id === customer.id && (
                  <div style={{ padding: '16px 20px', background: '#0a0a0f', borderTop: '0.5px solid #1e2a3a', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {[
                      { label: 'Business ID', value: customer.id },
                      { label: 'Owner ID', value: customer.owner_id },
                      { label: 'Plan', value: customer.plan },
                      { label: 'Bot name', value: customer.bot_name },
                      { label: 'Industry', value: customer.industry ?? 'Not set' },
                      { label: 'Signed up', value: new Date(customer.created_at).toLocaleString() },
                    ].map((item) => (
                      <div key={item.label}>
                        <p style={{ fontSize: 11, fontWeight: 500, color: '#8899aa', marginBottom: 4 }}>{item.label}</p>
                        <p style={{ fontSize: 11, color: '#cdd9e8', fontFamily: 'monospace', wordBreak: 'break-all' }}>{item.value}</p>
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