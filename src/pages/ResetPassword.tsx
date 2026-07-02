import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: '100%',
    background: '#0A0A0A',
    border: '0.5px solid #242424',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13,
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span aria-hidden="true" style={{ fontSize: 17, fontWeight: 700, color: '#0A0A0A', fontFamily: "'Space Grotesk', sans-serif" }}>D</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>Desklo</span>
          </div>
        </div>

        <div style={{ background: '#131313', border: '0.5px solid #242424', borderRadius: 16, padding: 32 }}>
          {done ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 6 }}>Password updated!</h2>
              <p style={{ fontSize: 13, color: '#9A9A94' }}>Redirecting you to your dashboard...</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 24 }}>Set new password</h2>
              <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>Confirm password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={6}
                    style={inputStyle}
                  />
                </div>
                {error && <p style={{ fontSize: 12, color: '#f87171' }}>{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', background: '#fff', color: '#0A0A0A', padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.5 : 1 }}
                >
                  {loading && <Loader2 size={14} color="#0A0A0A" />}
                  Update password
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
}