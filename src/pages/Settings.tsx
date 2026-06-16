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

  const [businessName, setBusinessName] = useState('');
  const [services, setServices] = useState('');
  const [hours, setHours] = useState('');
  const [pricing, setPricing] = useState('');
  const [booking, setBooking] = useState('');
  const [location, setLocation] = useState('');
  const [botName, setBotName] = useState('');
  const [brandColor, setBrandColor] = useState('#2563eb');

  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  async function loadSettings() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }
      setCurrentEmail(user.email ?? '');
      setNewEmail(user.email ?? '');
      const { data } = await supabase.from('businesses').select('*').eq('owner_id', user.id).single();
      if (data) {
        setBusinessName(data.name ?? '');
        setServices(data.services ?? '');
        setHours(data.hours ?? '');
        setPricing(data.pricing ?? '');
        setBooking(data.booking_info ?? '');
        setLocation(data.location ?? '');
        setBotName(data.bot_name ?? 'Assistant');
        setBrandColor(data.widget_color ?? '#2563eb');
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
      const { error: updateError } = await supabase.from('businesses').update({
        name: businessName, services, hours, pricing,
        booking_info: booking, location, bot_name: botName, widget_color: brandColor,
      }).eq('owner_id', user.id);
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
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setPasswordError('Password must be at least 6 characters'); return; }
    setPasswordSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordSaved(true);
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
      await supabase.from('businesses').delete().eq('owner_id', user.id);
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
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} color="#2563eb" />
      </div>
    );
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

  const card = { background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 16, padding: 24, marginBottom: 16 };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>

      {/* HEADER */}
      <header style={{ height: 56, borderBottom: '0.5px solid #1e2a3a', background: 'rgba(10,10,15,0.95)', display: 'flex', alignItems: 'center', padding: '0 24px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="#fff" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Desklo</span>
          </Link>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#8899aa', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to dashboard
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>Settings</h1>
          <p style={{ fontSize: 13, color: '#8899aa', marginTop: 4 }}>Update your business info, bot customization, and account details.</p>
        </div>

        {/* BUSINESS INFO */}
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 20 }}>Business information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Business name</label>
              <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Services offered</label>
              <textarea value={services} onChange={(e) => setServices(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Business hours</label>
                <input value={hours} onChange={(e) => setHours(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Pricing info</label>
                <input value={pricing} onChange={(e) => setPricing(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>How to book / contact</label>
                <input value={booking} onChange={(e) => setBooking(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* BOT CUSTOMIZATION */}
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 20 }}>Bot customization</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Bot name</label>
                <input value={botName} onChange={(e) => setBotName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 10 }}>Brand color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} style={{ width: 40, height: 40, borderRadius: 8, cursor: 'pointer', border: '0.5px solid #1e2a3a' }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['#2563EB', '#7B61FF', '#059669', '#EA580C', '#DC2626', '#7C3AED'].map((c) => (
                      <button key={c} onClick={() => setBrandColor(c)} style={{ width: 28, height: 28, borderRadius: 8, background: c, border: brandColor === c ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* PREVIEW */}
            <div style={{ background: '#0a0a0f', border: '0.5px solid #1e2a3a', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <Sparkles size={12} color="#8899aa" />
                <span style={{ fontSize: 11, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview</span>
              </div>
              <div style={{ borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, background: brandColor }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#86efac' }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{botName || 'Assistant'}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Online now</p>
                  </div>
                </div>
                <div style={{ background: '#0d1117', padding: 12 }}>
                  <div style={{ background: '#1e2a3a', borderRadius: '10px 10px 10px 2px', padding: '8px 12px', display: 'inline-block' }}>
                    <p style={{ fontSize: 12, color: '#cdd9e8', lineHeight: 1.5 }}>
                      Hi! 👋 I'm {botName || 'your assistant'} for {businessName || 'your business'}. How can I help?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && <p style={{ fontSize: 12, color: '#f87171', marginTop: 16 }}>{error}</p>}

          <button
            onClick={handleSaveBusiness}
            disabled={saving}
            style={{ width: '100%', marginTop: 20, padding: '12px', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: saving ? 0.5 : 1 }}
          >
            {saving && <Loader2 size={14} color="#fff" />}
            {saved ? <><Check size={14} color="#fff" /> Saved!</> : 'Save changes'}
          </button>
        </div>

        {/* CHANGE EMAIL */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Mail size={15} color="#8899aa" />
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Change email</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Current email</label>
              <input value={currentEmail} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>New email</label>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={inputStyle} />
            </div>
            {emailError && <p style={{ fontSize: 12, color: '#f87171' }}>{emailError}</p>}
            {emailSaved && <p style={{ fontSize: 12, color: '#34d399' }}>✅ Confirmation sent to your new email!</p>}
            <button
              onClick={handleChangeEmail}
              disabled={emailSaving || newEmail === currentEmail}
              style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (emailSaving || newEmail === currentEmail) ? 0.5 : 1 }}
            >
              {emailSaving && <Loader2 size={14} color="#fff" />}
              Update email
            </button>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Lock size={15} color="#8899aa" />
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Change password</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>New password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Confirm new password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" style={inputStyle} />
            </div>
            {passwordError && <p style={{ fontSize: 12, color: '#f87171' }}>{passwordError}</p>}
            {passwordSaved && <p style={{ fontSize: 12, color: '#34d399' }}>✅ Password updated successfully!</p>}
            <button
              onClick={handleChangePassword}
              disabled={passwordSaving || !newPassword}
              style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (passwordSaving || !newPassword) ? 0.5 : 1 }}
            >
              {passwordSaving && <Loader2 size={14} color="#fff" />}
              Update password
            </button>
          </div>
        </div>

        {/* DELETE ACCOUNT */}
        <div style={{ ...card, border: '0.5px solid #3a1e1e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Trash2 size={15} color="#f87171" />
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#f87171' }}>Delete account</h2>
          </div>
          <p style={{ fontSize: 12, color: '#8899aa', marginBottom: 16 }}>Permanently delete your account and all business data. This cannot be undone.</p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{ padding: '8px 16px', background: 'transparent', border: '0.5px solid #3a1e1e', color: '#f87171', fontSize: 13, fontWeight: 500, borderRadius: 10, cursor: 'pointer' }}
            >
              Delete my account
            </button>
          ) : (
            <div style={{ background: 'rgba(248,113,113,0.05)', border: '0.5px solid #3a1e1e', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#f87171' }}>Are you sure? This will delete everything.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: deleteLoading ? 0.5 : 1 }}
                >
                  {deleteLoading && <Loader2 size={13} color="#fff" />}
                  Yes, delete everything
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ padding: '8px 16px', background: 'transparent', border: '0.5px solid #1e2a3a', color: '#8899aa', fontSize: 13, fontWeight: 500, borderRadius: 8, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}