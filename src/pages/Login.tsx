import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Bot, ArrowLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromOnboarding = searchParams.get('onboarding') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (fromOnboarding) setMode('signup');
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) navigate('/dashboard');
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSent(true);
        return;
      }

      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        const pending = localStorage.getItem('pending_business');
        if (pending) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const biz = JSON.parse(pending);
            await supabase.from('businesses').upsert({
              owner_id: user.id,
              ...biz,
              plan: 'starter',
            }, { onConflict: 'owner_id' });
            localStorage.removeItem('pending_business');
            navigate('/dashboard');
            return;
          }
        }
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: '100%',
    background: '#0a0a0f',
    border: '0.5px solid #1e2a3a',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13,
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Desklo</span>
          </div>
          <p style={{ fontSize: 13, color: '#8899aa' }}>Your 24/7 AI receptionist</p>
        </div>

        <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 16, padding: 32 }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 6 }}>Check your email</h2>
              <p style={{ fontSize: 13, color: '#8899aa' }}>
                {mode === 'forgot'
                  ? `We sent a password reset link to ${email}`
                  : `We sent a confirmation link to ${email}`}
              </p>
              <button
                onClick={() => { setSent(false); setMode('login'); }}
                style={{ marginTop: 16, fontSize: 13, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              {fromOnboarding && mode === 'signup' && (
                <div style={{ background: 'rgba(37,99,235,0.1)', border: '0.5px solid rgba(37,99,235,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: '#60a5fa', fontWeight: 500 }}>Almost there! 🎉</p>
                  <p style={{ fontSize: 12, color: '#8899aa', marginTop: 4 }}>Create an account to save your bot and go live.</p>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                {mode === 'forgot' && (
                  <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8899aa', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={16} />
                  </button>
                )}
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
                  {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset your password'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </div>
                )}

                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); }}
                    style={{ fontSize: 12, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    Forgot your password?
                  </button>
                )}

                {error && <p style={{ fontSize: 12, color: '#f87171' }}>{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.5 : 1 }}
                >
                  {loading && <Loader2 size={14} color="#fff" />}
                  {mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
                </button>
              </form>

              {mode !== 'forgot' && (
                <p style={{ textAlign: 'center', fontSize: 13, color: '#8899aa', marginTop: 20 }}>
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    style={{ fontSize: 13, color: '#60a5fa', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}