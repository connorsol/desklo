import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, ArrowLeft, Loader2, Check, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [businessName, setBusinessName] = useState('');
  const [services, setServices] = useState('');
  const [hours, setHours] = useState('');
  const [pricing, setPricing] = useState('');
  const [booking, setBooking] = useState('');
  const [location, setLocation] = useState('');
  const [botName, setBotName] = useState('');
  const [brandColor, setBrandColor] = useState('#7B61FF');

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }

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

  async function handleSave() {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
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
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft size={15} /> Back to dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Update your business info and bot customization. Changes take effect instantly.</p>
        </div>

        <div className="space-y-6">

          {/* Business Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">Business Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name</label>
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Services offered</label>
                <textarea
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400 resize-none"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Business hours</label>
                  <input
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pricing info</label>
                  <input
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">How to book / contact</label>
                  <input
                    value={booking}
                    onChange={(e) => setBooking(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bot Customization */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">Bot Customization</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bot name</label>
                  <input
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand color</label>
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

              {/* Preview */}
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
          </div>

          {/* Save button */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saved ? <><Check size={15} /> Saved!</> : 'Save changes'}
          </button>

        </div>
      </div>
    </div>
  );
}