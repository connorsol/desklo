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
  ArrowUpRight,
  CreditCard,
  Loader2,
  Settings,
} from 'lucide-react';
import { ChatWidget } from '../components/ChatWidget';
import { supabase } from '../lib/supabase';
import type { Business } from '../lib/gemini';

interface Conversation {
  id: string;
  channel: 'web' | 'sms';
  lead: boolean;
  time: string;
  message: string;
  name: string;
}

const demoConversations: Conversation[] = [
  { id: '1', channel: 'web', lead: true, time: '2m ago', message: 'Hi, I need a quote for a water heater installation...', name: 'Sarah M.' },
  { id: '2', channel: 'sms', lead: true, time: '18m ago', message: "Can I schedule an appointment for tomorrow morning?", name: 'James T.' },
  { id: '3', channel: 'web', lead: false, time: '1h ago', message: 'What are your business hours?', name: 'Maria L.' },
  { id: '4', channel: 'web', lead: true, time: '3h ago', message: 'I have an emergency leak — how soon can someone come out?', name: 'David R.' },
  { id: '5', channel: 'sms', lead: true, time: '5h ago', message: 'Do you offer free estimates for drain cleaning?', name: 'Kim P.' },
  { id: '6', channel: 'web', lead: false, time: '8h ago', message: 'What areas do you serve?', name: 'Alex W.' },
];

const embedCode = `<script src="https://widget.desklo.ai/v1.js" data-key="dk_live_xxxxxxxxxxxx"></script>`;

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [widgetColor, setWidgetColor] = useState('#7B61FF');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

 useEffect(() => {
    checkAuthAndLoad();
  }, []);

  async function checkAuthAndLoad() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    loadBusiness();
  }

  async function loadBusiness() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      setUserName(user.email ?? '');

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (error || !data) { setLoading(false); return; }

      setBusiness({
        name: data.name,
        services: data.services ?? '',
        hours: data.hours ?? '',
        pricing: data.pricing ?? '',
        booking_info: data.booking_info ?? '',
        location: data.location ?? '',
        bot_name: data.bot_name ?? 'Assistant',
      });

      setWidgetColor(data.widget_color ?? '#7B61FF');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-brand-500" />
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

  const stats = [
    { label: 'Conversations This Month', value: '0', change: null, icon: MessageSquare },
    { label: 'Leads Captured', value: '0', change: null, icon: UserPlus },
    { label: 'After-Hours Conversations', value: '0', change: null, icon: Moon },
    { label: 'Total All Time', value: '0', change: null, icon: BarChart3 },
  ];

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
            <span className="hidden sm:block text-sm text-gray-400">|</span>
            <span className="hidden sm:block text-sm font-medium text-gray-600">
              {activeBusiness.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 hidden md:block">{userName}</span>
            <Link to="/settings" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <Settings size={15} />
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {!business && (
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 mb-8 flex items-center justify-between">
            <div>
              <p className="font-semibold text-brand-700">Welcome to Desklo! 👋</p>
              <p className="text-sm text-brand-600 mt-0.5">Complete your setup to get your AI receptionist live.</p>
            </div>
            <Link
              to="/onboarding"
              className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors flex-shrink-0"
            >
              Complete setup →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                  <s.icon size={18} className="text-brand-500" />
                </div>
                {s.change && (
                  <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {s.change}
                    <ArrowUpRight size={10} />
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Recent Conversations</h2>
              <span className="text-xs text-gray-400">{demoConversations.length} conversations</span>
            </div>
            <div className="divide-y divide-gray-50">
              {demoConversations.map((c) => (
                <div key={c.id} className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-gray-500">
                      {c.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-gray-900">{c.name}</span>
                      <span className={`text-[10px] font-medium uppercase px-1.5 py-0.5 rounded ${
                        c.channel === 'sms' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {c.channel}
                      </span>
                      {c.lead && (
                        <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-brand-50 text-brand-600">
                          Lead
                        </span>
                      )}
                      <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{c.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{c.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Embed Code</h3>
              <div className="relative">
                <pre className="bg-gray-900 rounded-xl p-4 text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap">
                  {embedCode}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Add this before the closing &lt;/body&gt; tag on your website.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Your Plan</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Trial</p>
                  <p className="text-xs text-gray-500">14 days free</p>
                </div>
                <CreditCard size={18} className="text-gray-300" />
              </div>
              <ul className="space-y-2 mb-5">
                {['Chat widget', 'Lead capture', 'Dashboard', 'Monthly reports'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <Check size={12} className="text-brand-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors">
                Upgrade to Pro
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Test Your Bot</h3>
              <p className="text-xs text-gray-400 mb-3">
                Click the chat bubble to test your AI receptionist live.
              </p>
              <div className="bg-brand-50 rounded-xl p-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-brand-700 font-medium">
                  {activeBusiness.bot_name} is online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatWidget business={activeBusiness} color={widgetColor} />
    </div>
  );
}