import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bot,
  Users,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Eye,
  ArrowLeft,
  Loader2,
  Search,
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
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    trialCustomers: 0,
    paidCustomers: 0,
    estimatedMRR: 0,
  });
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  async function checkAdminAndLoad() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
        navigate('/dashboard');
        return;
      }

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

        setStats({
          totalCustomers: businesses.length,
          trialCustomers: trial,
          paidCustomers: paid,
          estimatedMRR: mrr,
        });
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-brand-500" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="h-16 border-b border-gray-100 bg-white flex items-center px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">Desklo</span>
            </Link>
            <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">Admin</span>
          </div>
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
            <ArrowLeft size={15} /> Back to dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Trial Users', value: stats.trialCustomers, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Paid Customers', value: stats.paidCustomers, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Monthly Revenue', value: `$${stats.estimatedMRR}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon size={18} className={s.color} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-gray-900">All Customers</h2>
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <div className="px-6 py-10 text-center text-gray-400 text-sm">
                No customers yet — share your site to get signups!
              </div>
            )}
            {filtered.map((customer) => (
              <div key={customer.id}>
                <div
                  className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedCustomer(selectedCustomer?.id === customer.id ? null : customer)}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                    style={{ background: customer.widget_color ?? '#7B61FF' }}
                  >
                    {customer.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{customer.name ?? 'Unnamed'}</span>
                      <span className="text-xs text-gray-400">{customer.industry}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Bot: {customer.bot_name} · Signed up {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      customer.plan === 'pro' ? 'bg-violet-50 text-violet-600' :
                      customer.plan === 'starter' ? 'bg-green-50 text-green-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {customer.plan}
                    </span>
                    <Eye size={14} className="text-gray-300" />
                  </div>
                </div>

                {selectedCustomer?.id === customer.id && (
                  <div className="px-6 pb-4 bg-gray-50/50 border-t border-gray-50">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Business ID</p>
                        <p className="text-xs font-mono text-gray-700 break-all">{customer.id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Owner ID</p>
                        <p className="text-xs font-mono text-gray-700 break-all">{customer.owner_id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Plan</p>
                        <p className="text-xs text-gray-700 capitalize">{customer.plan}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Bot name</p>
                        <p className="text-xs text-gray-700">{customer.bot_name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Industry</p>
                        <p className="text-xs text-gray-700">{customer.industry ?? 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Signed up</p>
                        <p className="text-xs text-gray-700">{new Date(customer.created_at).toLocaleString()}</p>
                      </div>
                    </div>
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