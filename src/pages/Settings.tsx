import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Check, Sparkles, Mail, Lock, Trash2, Shield, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function Settings() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
  const [brandColor, setBrandColor] = useState('#111827');

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

  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaStep, setMfaStep] = useState<'idle' | 'setup'>('idle');
  const [qrCode, setQrCode] = useState('');
  const [factorId, setFactorId] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');

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
        setBrandColor(data.widget_color ?? '#111827');
      }

      const { data: factorsData } = await supabase.auth.mfa.listFactors();
      const verified = factorsData?.totp?.find((f: any) => f.status === 'verified');
      setMfaEnabled(!!verified);
      if (verified) setFactorId(verified.id);
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

  async function handleSetupMfa() {
    setMfaLoading(true);
    setMfaError('');
    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', issuer: 'Desklo' });
      if (error) throw error;
      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setMfaStep('setup');
    } catch (err: unknown) {
      setMfaError(err instanceof Error ? err.message : 'Failed to set up 2FA');
    } finally {
      setMfaLoading(false);
    }
  }

  async function handleVerifyMfa() {
    setMfaLoading(true);
    setMfaError('');
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: mfaCode,
      });
      if (verifyError) throw verifyError;
      setMfaEnabled(true);
      setMfaStep('idle');
      setMfaCode('');
      setQrCode('');
    } catch (err: unknown) {
      setMfaError(err instanceof Error ? err.message : 'Invalid code — please try again');
    } finally {
      setMfaLoading(false);
    }
  }

  async function handleCancelMfa() {
    try {
      if (factorId && !mfaEnabled) {
        await supabase.auth.mfa.unenroll({ factorId });
      }
    } catch (err) {
      console.error(err);
    }
    setMfaStep('idle');
    setMfaCode('');
    setQrCode('');
    setMfaError('');
  }

  async function handleDisableMfa() {
    setMfaLoading(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;
      setMfaEnabled(false);
      setFactorId('');
    } catch (err: unknown) {
      setMfaError(err instanceof Error ? err.message : 'Failed to disable 2FA');
    } finally {
      setMfaLoading(false);
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
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} color="#fff" />
      </div>
    );
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

  const card = {
    background: '#131313',
    border: '0.5px solid #242424',
    borderRadius: 16,
    padding: isMobile ? 18 : 24,
    marginBottom: 16,
  };

  const helperText = {
    fontSize: 11,
    color: '#9A9A94',
    marginTop: 5,
    lineHeight: 1.5,
  } as const;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>

      {/* HEADER */}
      <header style={{ height: 56, borderBottom: '0.5px solid #242424', background: 'rgba(10,10,10,0.95)', display: 'flex', alignItems: 'center', padding: '0 20px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span aria-hidden="true" style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', fontFamily: "'Space Grotesk', sans-serif" }}>D</span>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>Desklo</span>
          </Link>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9A9A94', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to dashboard
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 24px' }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: '#fff' }}>Settings</h1>
          <p style={{ fontSize: 13, color: '#9A9A94', marginTop: 4 }}>Update your business info, bot customization, and account details.</p>
        </div>

        {/* BUSINESS INFO */}
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Business information</h2>
          <p style={{ fontSize: 12, color: '#9A9A94', marginBottom: 12, lineHeight: 1.6 }}>This is what your AI receptionist uses to answer customer questions. Keep it accurate and detailed — the more info you provide, the better your bot performs.</p>

          <div style={{ display: 'flex', gap: 10, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
            <Info size={15} color="#fff" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: '#F5F5F3', lineHeight: 1.6, margin: 0 }}>
              💡 <strong>Tip:</strong> List every service you offer with its price, your exact hours for each day, and your full service area. If a customer asks something your bot doesn't have info on, it won't be able to answer accurately.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>Business name</label>
              <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>Services offered</label>
              <textarea
                value={services}
                onChange={(e) => setServices(e.target.value)}
                placeholder="List every service you offer. e.g.&#10;- Drain cleaning&#10;- Pipe repair and replacement&#10;- Water heater installation&#10;- Emergency plumbing&#10;- Sewer line inspection"
                rows={5}
                style={{ ...inputStyle, resize: 'none' }}
              />
              <p style={helperText}>List all services individually — your AI uses this to tell customers exactly what you offer.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>Business hours</label>
                <input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. Mon–Fri 8am–6pm, Sat 9am–2pm, Closed Sunday" style={inputStyle} />
                <p style={helperText}>Include every day so customers always get accurate hours.</p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>Pricing</label>
                <input value={pricing} onChange={(e) => setPricing(e.target.value)} placeholder="e.g. Drain cleaning $150, Water heater install $800–$1,200, Free estimates" style={inputStyle} />
                <p style={helperText}>List pricing per service so your bot can give accurate quotes.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>How to book / contact</label>
                <input value={booking} onChange={(e) => setBooking(e.target.value)} placeholder="e.g. Book through this chat, call 555-1234, or visit our website" style={inputStyle} />
                <p style={helperText}>Let customers know how to reach you outside of this chat.</p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>Location / service area</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Austin, TX — serving Travis and Williamson County" style={inputStyle} />
                <p style={helperText}>Include your city and surrounding areas you serve.</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOT CUSTOMIZATION */}
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 20 }}>Bot customization</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>Bot name</label>
                <input value={botName} onChange={(e) => setBotName(e.target.value)} style={inputStyle} />
                <p style={helperText}>Give your bot a friendly name like "Alex" or "Sarah".</p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 10 }}>Brand color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} style={{ width: 40, height: 40, borderRadius: 8, cursor: 'pointer', border: '0.5px solid #242424', flexShrink: 0 }} />
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['#111827', '#2563EB', '#7B61FF', '#059669', '#EA580C', '#DC2626', '#7C3AED'].map((c) => (
                      <button key={c} onClick={() => setBrandColor(c)} style={{ width: 28, height: 28, borderRadius: 8, background: c, border: brandColor === c ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ background: '#0A0A0A', border: '0.5px solid #242424', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <Sparkles size={12} color="#9A9A94" />
                <span style={{ fontSize: 11, color: '#9A9A94', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview</span>
              </div>
              <div style={{ borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, background: brandColor }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#86efac' }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{botName || 'Assistant'}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Online now</p>
                  </div>
                </div>
                <div style={{ background: '#131313', padding: 12 }}>
                  <div style={{ background: '#242424', borderRadius: '10px 10px 10px 2px', padding: '8px 12px', display: 'inline-block', maxWidth: '100%' }}>
                    <p style={{ fontSize: 12, color: '#F5F5F3', lineHeight: 1.5, wordBreak: 'break-word' }}>
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
            style={{ width: '100%', marginTop: 20, padding: '12px', background: '#fff', color: '#0A0A0A', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: saving ? 0.5 : 1 }}
          >
            {saving && <Loader2 size={14} color="#0A0A0A" />}
            {saved ? <><Check size={14} color="#0A0A0A" /> Saved!</> : 'Save changes'}
          </button>
        </div>

        {/* CHANGE EMAIL */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Mail size={15} color="#9A9A94" />
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Change email</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>Current email</label>
              <input value={currentEmail} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>New email</label>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={inputStyle} />
            </div>
            {emailError && <p style={{ fontSize: 12, color: '#f87171' }}>{emailError}</p>}
            {emailSaved && <p style={{ fontSize: 12, color: '#34d399' }}>✅ Confirmation sent to your new email!</p>}
            <button
              onClick={handleChangeEmail}
              disabled={emailSaving || newEmail === currentEmail}
              style={{ width: '100%', padding: '10px', background: '#fff', color: '#0A0A0A', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (emailSaving || newEmail === currentEmail) ? 0.5 : 1 }}
            >
              {emailSaving && <Loader2 size={14} color="#0A0A0A" />}
              Update email
            </button>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Lock size={15} color="#9A9A94" />
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Change password</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>New password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>Confirm new password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" style={inputStyle} />
            </div>
            {passwordError && <p style={{ fontSize: 12, color: '#f87171' }}>{passwordError}</p>}
            {passwordSaved && <p style={{ fontSize: 12, color: '#34d399' }}>✅ Password updated successfully!</p>}
            <button
              onClick={handleChangePassword}
              disabled={passwordSaving || !newPassword}
              style={{ width: '100%', padding: '10px', background: '#fff', color: '#0A0A0A', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (passwordSaving || !newPassword) ? 0.5 : 1 }}
            >
              {passwordSaving && <Loader2 size={14} color="#0A0A0A" />}
              Update password
            </button>
          </div>
        </div>

        {/* TWO-FACTOR AUTHENTICATION */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Shield size={15} color="#9A9A94" />
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Two-factor authentication</h2>
            {mfaEnabled && (
              <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: '#34d399', background: 'rgba(52,211,153,0.1)', border: '0.5px solid rgba(52,211,153,0.3)', padding: '2px 8px', borderRadius: 999 }}>
                ✅ Enabled
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: '#9A9A94', marginBottom: 16, lineHeight: 1.6 }}>
            {mfaEnabled
              ? 'Your account is protected with two-factor authentication.'
              : 'Add an extra layer of security. Requires Google Authenticator or any TOTP app.'}
          </p>
          {mfaStep === 'setup' && qrCode && (
            <div style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 12, color: '#F5F5F3', marginBottom: 12, lineHeight: 1.6 }}>
                1. Open Google Authenticator or Authy<br />
                2. Scan the QR code below<br />
                3. Enter the 6-digit code to confirm
              </p>
              <div style={{ background: '#fff', borderRadius: 12, padding: 12, display: 'inline-block', marginBottom: 16 }}>
                <img src={qrCode} alt="QR Code" style={{ width: 160, height: 160, display: 'block' }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#F5F5F3', marginBottom: 6 }}>Enter the 6-digit code</label>
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                  style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 18, letterSpacing: '0.3em', textAlign: 'center' }}
                />
              </div>
              {mfaError && <p style={{ fontSize: 12, color: '#f87171', marginBottom: 8 }}>{mfaError}</p>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleVerifyMfa}
                  disabled={mfaLoading || mfaCode.length !== 6}
                  style={{ flex: 1, padding: '10px', background: '#fff', color: '#0A0A0A', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 10, cursor: 'pointer', opacity: (mfaLoading || mfaCode.length !== 6) ? 0.5 : 1 }}
                >
                  {mfaLoading ? 'Verifying...' : 'Enable 2FA'}
                </button>
                <button
                  onClick={handleCancelMfa}
                  style={{ padding: '10px 16px', background: 'transparent', border: '0.5px solid #242424', color: '#9A9A94', fontSize: 13, borderRadius: 10, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {mfaStep === 'idle' && (
            <button
              onClick={mfaEnabled ? handleDisableMfa : handleSetupMfa}
              disabled={mfaLoading}
              style={{
                padding: '8px 16px',
                background: mfaEnabled ? 'transparent' : '#fff',
                border: mfaEnabled ? '0.5px solid #3a1e1e' : 'none',
                color: mfaEnabled ? '#f87171' : '#0A0A0A',
                fontSize: 13, fontWeight: 500, borderRadius: 10, cursor: 'pointer',
                opacity: mfaLoading ? 0.5 : 1,
              }}
            >
              {mfaLoading ? 'Loading...' : mfaEnabled ? '🔓 Disable 2FA' : '🔐 Enable 2FA'}
            </button>
          )}
        </div>

        {/* DELETE ACCOUNT */}
        <div style={{ ...card, border: '0.5px solid #3a1e1e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Trash2 size={15} color="#f87171" />
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#f87171' }}>Delete account</h2>
          </div>
          <p style={{ fontSize: 12, color: '#9A9A94', marginBottom: 16 }}>Permanently delete your account and all business data. This cannot be undone.</p>
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
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
                  style={{ padding: '8px 16px', background: 'transparent', border: '0.5px solid #242424', color: '#9A9A94', fontSize: 13, fontWeight: 500, borderRadius: 8, cursor: 'pointer' }}
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