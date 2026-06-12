import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Bot } from 'lucide-react';

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
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {done ? (
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h2 className="font-semibold text-gray-900 mb-1">Password updated!</h2>
              <p className="text-sm text-gray-500">Redirecting you to your dashboard...</p>
            </div>
          ) : (
            <>
              <h2 className="font-semibold text-gray-900 mb-6">Set new password</h2>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Confirm password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={6}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-brand-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
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