import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ArrowRight, ArrowLeft, Palette, Sparkles, Loader2, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

const WORKER_URL = 'https://desklo-worker.connorcarson222.workers.dev';

const industries = [
  'Plumbing', 'HVAC', 'Electrical', 'Salon', 'Dental',
  'Legal', 'Real Estate', 'Gym', 'Restaurant', 'Other',
];

const industryEmojis: Record<string, string> = {
  Plumbing: '🔧', HVAC: '❄️', Electrical: '⚡', Salon: '✂️', Dental: '🦷',
  Legal: '⚖️', 'Real Estate': '🏠', Gym: '💪', Restaurant: '🍽️', Other: '✨',
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [industry, setIndustry] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [services, setServices] = useState('');
  const [hours, setHours] = useState('');
  const [pricing, setPricing] = useState('');
  const [booking, setBooking] = useState('');
  const [location, setLocation] = useState('');
  const [botName, setBotName] = useState('Assistant');
  const [brandColor, setBrandColor] = useState('#2563eb');

  const canNext = () => {
    if (step === 1) return industry !== '';
    if (step === 2) return businessName.trim() !== '';
    return true;
  };

  const handleGoogleLogin = async () => {
    setSaving(true);
    setError('');
    const businessData = {
      industry, name: businessName, services, hours, pricing,
      booking_info: booking, location, bot_name: botName, widget_color: brandColor,
    };
    localStorage.setItem('pending_business', JSON.stringify(businessData));
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setError('Google login failed. Please try again.');
      setSaving(false);
    }
  };

  async function redirectToCheckout(email: string, businessId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? '';
    const refresh = session?.refresh_token ?? '';
    const res = await fetch(`${WORKER_URL}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, businessId, token, refresh }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error('No checkout URL returned');
    }
  }

  const handleNext = async () => {
    if (step < 3) { setStep(step + 1); return; }
    setSaving(true);
    setError('');
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        const businessData = {
          industry, name: businessName, services, hours, pricing,
          booking_info: booking, location, bot_name: botName, widget_color: brandColor,
        };
        localStorage.setItem('pending_business', JSON.stringify(businessData));
        navigate('/login?onboarding=true');
        return;
      }
      const { data: insertedBusiness, error: insertError } = await supabase
        .from('businesses')
        .upsert({
          owner_id: user.id, industry, name: businessName, services, hours, pricing,
          booking_info: booking, location, bot_name: botName, widget_color: brandColor, plan: 'trial',
        }, { onConflict: 'owner_id' })
        .select('id')
        .single();
      if (insertError) throw insertError;
      await redirectToCheckout(user.email ?? '', insertedBusiness.id);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  };

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

  const helperText = {
    fontSize: 11,
    color: '#8899aa',
    marginTop: 5,
    lineHeight: 1.5,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <header style={{ height: 56, borderBottom: '0.5px solid #1e2a3a', background: 'rgba(10,10,15,0.95)', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="#fff" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Desklo</span>
          </div>
          <span style={{ fontSize: 13, color: '#8899aa' }}>Step {step} of 3</span>
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div style={{ height: 2, background: '#1e2a3a' }}>
        <div style={{ height: '100%', background: '#2563eb', width: `${(step / 3) * 100}%`, transition: 'width 0.5s ease' }} />
      </div>

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 680 }}>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>What industry are you in?</h1>
              <p style={{ fontSize: 13, color: '#8899aa', marginBottom: 32 }}>This helps us tailor your AI receptionist to your business.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      padding: '16px 8px', borderRadius: 12, cursor: 'pointer',
                      border: industry === ind ? '2px solid #2563eb' : '0.5px solid #1e2a3a',
                      background: industry === ind ? 'rgba(37,99,235,0.1)' : '#0d1117',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{industryEmojis[ind]}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: industry === ind ? '#60a5fa' : '#8899aa' }}>{ind}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Tell us about your business</h1>
              <p style={{ fontSize: 13, color: '#8899aa', marginBottom: 16 }}>This information is what your AI receptionist uses to answer customer questions. The more accurate and detailed you are, the better your bot will perform.</p>

              {/* INFO BANNER */}
              <div style={{ display: 'flex', gap: 10, background: 'rgba(37,99,235,0.08)', border: '0.5px solid rgba(37,99,235,0.3)', borderRadius: 10, padding: '12px 14px', marginBottom: 24 }}>
                <Info size={15} color="#60a5fa" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: '#60a5fa', lineHeight: 1.6, margin: 0 }}>
                  💡 <strong>Tip:</strong> List every service you offer, your exact hours, and real pricing for each service. Your AI will use this to answer customer questions accurately — if the info is missing or vague, the bot won't know what to say.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Business name <span style={{ color: '#f87171' }}>*</span></label>
                  <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Mike's Plumbing" style={inputStyle} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Services offered</label>
                  <textarea
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    placeholder="List every service you offer. e.g.&#10;- Drain cleaning&#10;- Pipe repair and replacement&#10;- Water heater installation&#10;- Emergency plumbing&#10;- Sewer line inspection"
                    rows={5}
                    style={{ ...inputStyle, resize: 'none' }}
                  />
                  <p style={helperText}>List all services individually — this is how your AI knows what you offer when customers ask.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Business hours</label>
                    <input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. Mon–Fri 8am–6pm, Sat 9am–2pm, Closed Sunday" style={inputStyle} />
                    <p style={helperText}>Include every day of the week so the bot never gives wrong hours.</p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Pricing</label>
                    <input value={pricing} onChange={(e) => setPricing(e.target.value)} placeholder="e.g. Drain cleaning $150, Water heater install $800–$1,200, Free estimates" style={inputStyle} />
                    <p style={helperText}>List pricing per service so customers get accurate quotes from your bot.</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>How to book / contact</label>
                    <input value={booking} onChange={(e) => setBooking(e.target.value)} placeholder="e.g. Book through this chat, call 555-1234, or visit our website" style={inputStyle} />
                    <p style={helperText}>Let customers know how to reach you or book outside of the chat.</p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Location / service area</label>
                    <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Austin, TX — serving Travis and Williamson County" style={inputStyle} />
                    <p style={helperText}>Include your city and any surrounding areas you serve.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Customize your bot</h1>
              <p style={{ fontSize: 13, color: '#8899aa', marginBottom: 32 }}>Give your AI receptionist a name and match it to your brand.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 6 }}>Bot name</label>
                    <input value={botName} onChange={(e) => setBotName(e.target.value)} placeholder="Assistant" style={inputStyle} />
                    <p style={helperText}>Give your bot a friendly name like "Alex" or "Sarah".</p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#cdd9e8', marginBottom: 10 }}>Brand color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} style={{ width: 40, height: 40, borderRadius: 8, cursor: 'pointer', border: '0.5px solid #1e2a3a' }} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['#2563EB', '#7B61FF', '#059669', '#EA580C', '#DC2626', '#7C3AED'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setBrandColor(c)}
                            style={{ width: 32, height: 32, borderRadius: 8, background: c, border: brandColor === c ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', transform: brandColor === c ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.1s' }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* PREVIEW */}
                <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 14, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                    <Palette size={13} color="#8899aa" />
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview</span>
                  </div>
                  <div style={{ borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, background: brandColor }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={14} color="#fff" />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{botName || 'Assistant'}</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Online now</p>
                      </div>
                    </div>
                    <div style={{ background: '#0a0a0f', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Sparkles size={10} color="#fff" />
                        </div>
                        <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: '12px 12px 12px 2px', padding: '8px 12px', maxWidth: '80%' }}>
                          <p style={{ fontSize: 12, color: '#cdd9e8', lineHeight: 1.5 }}>Hi! Welcome to {businessName || 'your business'}. How can I help you today?</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ background: brandColor, borderRadius: '12px 12px 2px 12px', padding: '8px 12px', maxWidth: '80%' }}>
                          <p style={{ fontSize: 12, color: '#fff' }}>I need to schedule a visit</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {error && <p style={{ fontSize: 13, color: '#f87171', marginTop: 16 }}>{error}</p>}

              <button
                onClick={handleGoogleLogin}
                disabled={saving}
                style={{ width: '100%', marginTop: 24, padding: '12px', background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 10, fontSize: 13, fontWeight: 500, color: '#cdd9e8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: saving ? 0.5 : 1 }}
              >
                {saving && <Loader2 size={14} color="#cdd9e8" />}
                Continue with Google
              </button>
            </div>
          )}

          {/* NAV BUTTONS */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
            <button
              onClick={() => setStep(step - 1)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 10, fontSize: 13, fontWeight: 500, color: '#8899aa', cursor: 'pointer', visibility: step === 1 ? 'hidden' : 'visible' }}
            >
              <ArrowLeft size={15} /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext() || saving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', opacity: (!canNext() || saving) ? 0.4 : 1 }}
            >
              {saving && <Loader2 size={14} color="#fff" />}
              {step === 3 ? 'Continue to Payment' : 'Continue'}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}