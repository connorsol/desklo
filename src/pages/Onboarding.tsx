import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ArrowRight, ArrowLeft, Palette, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  const [brandColor, setBrandColor] = useState('#7B61FF');

  const canNext = () => {
    if (step === 1) return industry !== '';
    if (step === 2) return businessName.trim() !== '';
    return true;
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Step 3 — save to Supabase
    setSaving(true);
    setError('');

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        // Not logged in — save to localStorage and redirect to signup
        const businessData = {
          industry,
          name: businessName,
          services,
          hours,
          pricing,
          booking_info: booking,
          location,
          bot_name: botName,
          widget_color: brandColor,
        };
        localStorage.setItem('pending_business', JSON.stringify(businessData));
        navigate('/login?onboarding=true');
        return;
      }

      // Logged in — save directly to Supabase
      const { error: insertError } = await supabase
        .from('businesses')
        .upsert({
          owner_id: user.id,
          industry,
          name: businessName,
          services,
          hours,
          pricing,
          booking_info: booking,
          location,
          bot_name: botName,
          widget_color: brandColor,
          plan: 'trial',
        }, { onConflict: 'owner_id' });

      if (insertError) throw insertError;

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 border-b border-gray-100 bg-white flex items-center px-6">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">Desklo</span>
          </div>
          <span className="text-sm text-gray-400">Step {step} of 3</span>
        </div>
      </header>

      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-brand-500 transition-all duration-500 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {step === 1 && (
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-2">
                What industry are you in?
              </h1>
              <p className="text-sm text-gray-500 mb-8">
                This helps us tailor your AI receptionist to your business.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      industry === ind
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <span className="text-2xl">{industryEmojis[ind]}</span>
                    <span className="text-xs font-medium text-gray-700">{ind}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Tell us about your business
              </h1>
              <p className="text-sm text-gray-500 mb-8">
                This information trains your AI receptionist so it can answer customer questions accurately.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name</label>
                  <input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Acme Plumbing"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Services offered</label>
                  <textarea
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    placeholder="Drain cleaning, pipe repair, water heater installation..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Business hours</label>
                    <input
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      placeholder="Mon–Fri 8am–6pm"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Pricing info</label>
                    <input
                      value={pricing}
                      onChange={(e) => setPricing(e.target.value)}
                      placeholder="$75/hr, free estimates"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">How to book / contact</label>
                    <input
                      value={booking}
                      onChange={(e) => setBooking(e.target.value)}
                      placeholder="Call 555-1234 or book online"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Austin, TX"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Customize your bot
              </h1>
              <p className="text-sm text-gray-500 mb-8">
                Give your AI receptionist a name and match it to your brand.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bot name</label>
                    <input
                      value={botName}
                      onChange={(e) => setBotName(e.target.value)}
                      placeholder="Assistant"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                      />
                      <div className="flex gap-2">
                        {['#7B61FF', '#2563EB', '#059669', '#EA580C', '#DC2626', '#7C3AED'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setBrandColor(c)}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                              brandColor === c ? 'border-gray-900 scale-110' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette size={14} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Preview</span>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-sm">
                    <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: brandColor }}>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Sparkles size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{botName || 'Assistant'}</p>
                        <p className="text-xs text-white/70">Online now</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 space-y-3">
                      <div className="flex gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: brandColor }}
                        >
                          <Sparkles size={10} className="text-white" />
                        </div>
                        <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 max-w-[80%]">
                          <p className="text-xs text-gray-700 leading-relaxed">
                            Hi! Welcome to {businessName || 'our business'}. How can I help you today?
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div
                          className="rounded-xl rounded-tr-sm px-3 py-2 max-w-[80%]"
                          style={{ backgroundColor: brandColor }}
                        >
                          <p className="text-xs text-white">I need to schedule a visit</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-4">{error}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-10">
            <button
              onClick={handleBack}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors ${
                step === 1 ? 'invisible' : ''
              }`}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext() || saving}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {step === 3 ? 'Go to Dashboard' : 'Continue'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}