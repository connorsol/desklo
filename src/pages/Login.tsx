import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Bot, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromOnboarding = searchParams.get('onboarding') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (fromOnboarding) setMode('signup');

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) navigate('/dashboard');
    });
  }, [fromOnboarding, navigate]);

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

            await supabase.from('businesses').upsert(
              {
                owner_id: user.id,
                ...biz,
                plan: 'trial',
              },
              { onConflict: 'owner_id' }
            );

            localStorage.removeItem('pending_business');
            navigate('/dashboard');
            return;
          }
        }

        setSent(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Desklo</span>
          </div>
          <p className="text-gray-500 text-sm">Your 24/7 AI receptionist</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-3">📬</div>

              <h2 className="font-semibold text-gray-900 mb-1">Check your email</h2>

              <p className="text-sm text-gray-500">
                {mode === 'forgot'
                  ? `We sent a password reset link to ${email}`
                  : `We sent a confirmation link to ${email}`}
              </p>

              <button
                onClick={() => {
                  setSent(false);
                  setMode('login');
                }}
                className="mt-4 text-sm text-brand-500 hover:underline"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              {fromOnboarding && mode === 'signup' && (
                <div className="bg-brand-50 rounded-xl p-3 mb-5 text-center">
                  <p className="text-sm text-brand-700 font-medium">Almost there! 🎉</p>
                  <p className="text-xs text-brand-600 mt-0.5">
                    Create an account to save your bot and go live.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mb-6">
                {mode === 'forgot' && (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}

                <h2 className="font-semibold text-gray-900">
                  {mode === 'login'
                    ? 'Welcome back'
                    : mode === 'signup'
                      ? 'Create your account'
                      : 'Reset your password'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-brand-400"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                    }}
                    className="text-xs text-brand-500 hover:underline"
                  >
                    Forgot your password?
                  </button>
                )}

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-brand-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {mode === 'login'
                    ? 'Sign in'
                    : mode === 'signup'
                      ? 'Create account — free for 14 days'
                      : 'Send reset link'}
                </button>
              </form>

              {mode !== 'forgot' && (
                <p className="text-center text-sm text-gray-500 mt-5">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}

                  <button
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-brand-500 font-medium hover:underline"
                  >
                    {mode === 'login' ? 'Sign up free' : 'Sign in'}
                  </button>
                </p>
              )}
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          14-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </div>
  );
}