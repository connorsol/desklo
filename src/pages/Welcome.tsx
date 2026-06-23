import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, ArrowRight, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Welcome() {
  const navigate = useNavigate();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [botName, setBotName] = useState('Assistant');
  const [businessName, setBusinessName] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // Grab token from URL if present
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const refreshToken = params.get('refresh');

      if (token) {
        // Restore session from token, then clean URL
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: refreshToken ?? '',
        });
        window.history.replaceState({}, '', '/welcome');
      }

      await loadBusiness();
    }
    init();
  }, []);

  async function loadBusiness() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('businesses')
        .select('id, name, bot_name')
        .eq('owner_id', user.id)
        .single();
      if (data) {
        setBusinessId(data.id);
        setBotName(data.bot_name ?? 'Assistant');
        setBusinessName(data.name ?? '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const embedCode = businessId
    ? `<script>window.DESKLO_KEY = '${businessId}';</script>\n<script src="https://deskloai.com/widget.js"></script>`
    : '';

  const handleCopy = () => {
    if (!embedCode) return;
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const steps = [
    {
      num: '01',
      title: 'Copy your embed code',
      desc: 'Use the code below — paste it before the closing </body> tag on your website.',
    },
    {
      num: '02',
      title: 'Add it to your website',
      desc: 'Works on Wix, WordPress, Squarespace, Shopify, or any website platform.',
    },
    {
      num: '03',
      title: "You're live!",
      desc: `${botName} will start answering customer questions immediately, 24/7.`,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <header style={{ height: 56, borderBottom: '0.5px solid #1e2a3a', background: 'rgba(10,10,15,0.95)', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Desklo</span>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: 600 }}>

          {/* HERO */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
              You're all set{businessName ? `, ${businessName.split(' ')[0]}` : ''}!
            </h1>
            <p style={{ fontSize: 15, color: '#8899aa', lineHeight: 1.7, maxWidth: 440, margin: '0 auto' }}>
              Your AI receptionist <strong style={{ color: '#fff' }}>{botName}</strong> is ready to go. Add it to your website in 60 seconds.
            </p>
          </div>

          {/* STEPS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 14, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 11, color: '#2563eb', fontFamily: 'monospace', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{s.num}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{s.title}</p>
                  <p style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* EMBED CODE */}
          {!loading && embedCode && (
            <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 14, padding: 20, marginBottom: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#cdd9e8', marginBottom: 10 }}>Your embed code</p>
              <div style={{ position: 'relative' }}>
                <pre style={{ background: '#0a0a0f', border: '0.5px solid #1e2a3a', borderRadius: 10, padding: '14px 16px', fontSize: 11, color: '#8899aa', fontFamily: 'monospace', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0, paddingRight: 44 }}>
                  {embedCode}
                </pre>
                <button
                  onClick={handleCopy}
                  style={{ position: 'absolute', top: 10, right: 10, padding: 6, borderRadius: 6, background: '#1e2a3a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {copied ? <Check size={13} color="#34d399" /> : <Copy size={13} color="#8899aa" />}
                </button>
              </div>
              <p style={{ fontSize: 11, color: '#8899aa', marginTop: 10 }}>
                Paste this before the <code style={{ color: '#60a5fa' }}>&lt;/body&gt;</code> tag on your website.
              </p>
            </div>
          )}

          {/* CTA BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link
              to="/install"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 600, borderRadius: 12, textDecoration: 'none' }}
            >
              View installation guide <ArrowRight size={15} />
            </Link>
            <Link
              to="/dashboard"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', background: 'transparent', color: '#8899aa', fontSize: 13, border: '0.5px solid #1e2a3a', borderRadius: 12, textDecoration: 'none' }}
            >
              Go to dashboard
            </Link>
          </div>

          {!businessId && !loading && (
            <p style={{ textAlign: 'center', fontSize: 11, color: '#8899aa', marginTop: 16 }}>
              Your embed code is available in your dashboard after logging in.
            </p>
          )}

        </div>
      </main>
    </div>
  );
}