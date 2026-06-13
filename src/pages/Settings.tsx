import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, ArrowLeft, Loader2, Check, Sparkles, Mail, Lock, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Business fields
  const [businessName, setBusinessName] = useState('');
  const [services, setServices] = useState('');
  const [hours, setHours] = useState('');
  const [pricing, setPricing] = useState('');
  const [booking, setBooking] = useState('');
  const [location, setLocation] = useState('');
  const [botName, setBotName] = useState('');
  const [brandColor, setBrandColor] = useState('#7B61FF');

  // Account fields
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }

      setCurrentEmail(user.email ?? '');
      setNewEmail(user.email ?? '');

      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (data) {
        setBusinessName(data.name ?? '');
        setServices(data.services ?? '');
        setHours(data.hours ?? '');
        setPricing(data.pricing ?? '');
        setBooking(data.booking_info ?? '');
        setLocation(data.location ?? '');
        setBotName(data.bot_name ?? 'Assistant');
        setBrandColor(data.widget_color ?? '#7B61FF');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveBusiness() {
    setSaving(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const { error: updateError } = await supabase
        .from('businesses')
        .update({
          name: businessName,
          services,
          hours,
          pricing,
          booking_info: booking,
          location,
          bot_name: botName,
          widget_color: brandColor,
        })
        .eq('owner_id', user.id);

      if (updateError) throw updateError;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangeEmail() {
    setEmailSaving(true);
    setEmailError('');
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setEmailSaved(true);
      setTimeout(() => setEmailSaved(false), 3000);
    } catch (err: unknown) {
      setEmailError(err instanceof Error ? err.message : 'Failed to update email');
    } finally {
      setEmailSaving(false);
    }
  }

  async function handleChangePassword() {
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setPasswordSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSaved(false), 2000);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Delete business data first
      await supabase.from('businesses').delete().eq('owner_id', user.id);

      // Sign out
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="h-16 border-b border-gray-100 bg-white flex items-center px-6 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">Desklo</span>
            </Link>
          </div>
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
            <ArrowLeft size={15} /> Back to dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Update your business info, bot customization, and account details.</p>
        </div>

        <div className="space-y-6">

          {/* ── Business Info ─────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">Business Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name</label>
                <input value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Services offered</label>
                <textarea value={services} onChange={(e) => setServices(e.target.value)} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400 resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Business hours</label>
                  <input value={hours} onChange={(e) => setHours(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pricing info</label>
                  <input value={pricing} onChange={(e) => setPricing(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">How to book / contact</label>
                  <input value={booking} onChange={(e) => setBooking(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Bot Customization ─────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">Bot Customization</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bot name</label>
                  <input value={botName} onChange={(e) => setBotName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                    <div className="flex gap-2">
                      {['#7B61FF', '#2563EB', '#059669', '#EA580C', '#DC2626', '#7C3AED'].map((c) => (
                        <button key={c} onClick={() => setBrandColor(c)}
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${brandColor === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={12} className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Preview</span>
                </div>
                <div className="rounded-xl overflow-hidden shadow-sm">
                  <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: brandColor }}>
                    <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                    <div>
                      <p className="text-sm font-semibold text-white">{botName || 'Assistant'}</p>
                      <p className="text-xs text-white/70">Online now</p>
                    </div>
                  </div>
                  <div className="bg-white p-3">
                    <div className="bg-gray-100 rounded-xl rounded-tl-sm px-3 py-2 inline-block">
                      <p className="text-xs text-gray-700">
                        Hi! 👋 I'm {botName || 'your assistant'} for {businessName || 'your business'}. How can I help?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <button onClick={handleSaveBusiness} disabled={saving}
              className="w-full mt-6 py-3 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
              {saving && <Loader2 size={15} className="animate-spin" />}
              {saved ? <><Check size={15} /> Saved!</> : 'Save changes'}
            </button>
          </div>

          {/* ── Change Email ──────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Mail size={16} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Change Email</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current email</label>
                <input value={currentEmail} disabled
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New email</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
              </div>
              {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
              {emailSaved && <p className="text-green-600 text-xs">✅ Confirmation sent to your new email!</p>}
              <button onClick={handleChangeEmail} disabled={emailSaving || newEmail === currentEmail}
                className="w-full py-2.5 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors text-sm">
                {emailSaving && <Loader2 size={14} className="animate-spin" />}
                Update email
              </button>
            </div>
          </div>

          {/* ── Change Password ───────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Lock size={16} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
              </div>
              {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
              {passwordSaved && <p className="text-green-600 text-xs">✅ Password updated successfully!</p>}
              <button onClick={handleChangePassword} disabled={passwordSaving || !newPassword}
                className="w-full py-2.5 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors text-sm">
                {passwordSaving && <Loader2 size={14} className="animate-spin" />}
                Update password
              </button>
            </div>
          </div>

          {/* ── Delete Account ────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-red-100 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 size={16} className="text-red-400" />
              <h2 className="text-sm font-semibold text-red-600">Delete Account</h2>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Permanently delete your account and all business data. This cannot be undone.
            </p>

            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 border border-red-200 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors">
                Delete my account
              </button>
            ) : (
              <div className="bg-red-50 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-red-700">Are you sure? This will delete everything.</p>
                <div className="flex gap-3">
                  <button onClick={handleDeleteAccount} disabled={deleteLoading}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2 transition-colors">
                    {deleteLoading && <Loader2 size={13} className="animate-spin" />}
                    Yes, delete everything
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}