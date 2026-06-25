import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowLeft, Copy, Check, ExternalLink, X, ZoomIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

const platforms = [
  { id: 'wix', name: 'Wix', icon: '🌐' },
  { id: 'wordpress', name: 'WordPress', icon: '📝' },
  { id: 'squarespace', name: 'Squarespace', icon: '⬛' },
  { id: 'shopify', name: 'Shopify', icon: '🛍️' },
  { id: 'other', name: 'Other / Custom', icon: '💻' },
];

const wixStepImages: Record<number, string> = {
  0: '/install/wix_step1.png',
  1: '/install/wix_step1.png',
  2: '/install/wix_step2_3.png',
  3: '/install/wix_step4_7.png',
  4: '/install/wix_step4_7.png',
  5: '/install/wix_step4_7.png',
  6: '/install/wix_step4_7.png',
  7: '/install/wix_step8.png',
};

const steps: Record<string, { title: string; description: string; highlight?: string }[]> = {
  wix: [
    { title: 'Open your Wix dashboard', description: 'Go to manage.wix.com and open your site editor.' },
    { title: 'Go to Settings', description: 'Click Settings in the left sidebar of your Wix dashboard.' },
    { title: 'Click Custom Code', description: 'Under "Development & integrations", find and click "Custom code".' },
    { title: 'Add new code block', description: 'Click "+ Add Custom Code" in the top right.', highlight: '+ Add Custom Code' },
    { title: 'Paste the first script', description: 'Paste the first line of your embed code. Set placement to "Body - start". Click Apply.', highlight: 'Body - start' },
    { title: 'Add another code block', description: 'Click "+ Add Custom Code" again.' },
    { title: 'Paste the second script', description: 'Paste the second line of your embed code. Set placement to "Body - end". Click Apply.', highlight: 'Body - end' },
    { title: 'Publish your site', description: 'Click the Publish button in the top right. Your AI receptionist is now live!' },
  ],
  wordpress: [
    { title: 'Log in to WordPress', description: 'Go to your WordPress admin panel at yoursite.com/wp-admin.' },
    { title: 'Install a header/footer plugin', description: 'Go to Plugins → Add New. Search for "WPCode" (or "Insert Headers and Footers"). Click Install, then Activate.', highlight: 'WPCode' },
    { title: 'Open the plugin settings', description: 'In the left sidebar, go to Code Snippets → Header & Footer.' },
    { title: 'Paste the embed code', description: 'Paste both lines of your embed code into the "Footer" section.', highlight: 'Footer' },
    { title: 'Save changes', description: 'Click Save. Your AI receptionist is now live on your site!' },
  ],
  squarespace: [
    { title: 'Check your plan', description: "Code Injection requires a Business plan or higher.", highlight: 'Business plan' },
    { title: 'Open your Squarespace dashboard', description: 'Log in to your Squarespace account and open your site.' },
    { title: 'Go to Settings → Advanced', description: 'Click Settings in the left sidebar, then click "Advanced".' },
    { title: 'Click Code Injection', description: 'Click "Code Injection" to open the code editor.', highlight: 'Code Injection' },
    { title: 'Paste into Footer', description: 'Paste both lines of your embed code into the Footer field.', highlight: 'Footer' },
    { title: 'Save', description: 'Click Save in the top right. Your AI receptionist is now live!' },
  ],
  shopify: [
    { title: 'Open Shopify admin', description: 'Log in to your Shopify store at yourstore.myshopify.com/admin.' },
    { title: 'Go to Online Store → Themes', description: 'In the left sidebar click Online Store, then Themes.' },
    { title: 'Click Actions → Edit code', description: 'Next to your active theme, click Actions, then Edit code.', highlight: 'Edit code' },
    { title: 'Open theme.liquid', description: 'In the Layout folder on the left, find and click theme.liquid.' },
    { title: 'Paste the embed code', description: 'Paste both lines just before the closing </body> tag.', highlight: '</body>' },
    { title: 'Save', description: 'Click Save in the top right. Your AI receptionist is now live!' },
  ],
  other: [
    { title: 'Open your website code', description: 'Open the HTML file or template that contains your site footer.' },
    { title: 'Find the closing body tag', description: 'Search for </body> near the bottom of the file.', highlight: '</body>' },
    { title: 'Paste the embed code', description: 'Paste both lines of your embed code just before the </body> tag.' },
    { title: 'Save and deploy', description: 'Save the file and deploy your site. Your AI receptionist is now live!' },
  ],
};

export default function Install() {
  const [activePlatform, setActivePlatform] = useState('wix');
  const [copied, setCopied] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from('businesses').select('id').eq('owner_id', user.id).single().then(({ data }) => {
        if (data) setBusinessId(data.id);
      });
    });
  }, []);

  const embedCode = businessId
    ? `<script>window.DESKLO_KEY = '${businessId}';</script>\n<script src="https://deskloai.com/widget.js"></script>`
    : `<script>window.DESKLO_KEY = 'YOUR_BUSINESS_ID';</script>\n<script src="https://deskloai.com/widget.js"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const currentSteps = steps[activePlatform];
  const currentImage = activePlatform === 'wix' ? wixStepImages[activeStep] : null;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>

      {/* LIGHTBOX */}
      {lightboxOpen && currentImage && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, cursor: 'zoom-out' }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{ position: 'absolute', top: 20, right: 20, background: '#1e2a3a', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} color="#fff" />
          </button>
          <img
            src={currentImage}
            alt="Step screenshot"
            style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* HEADER */}
      <header style={{ height: 56, borderBottom: '0.5px solid #1e2a3a', background: 'rgba(10,10,15,0.95)', display: 'flex', alignItems: 'center', padding: '0 24px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>

        {/* TITLE */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Install your AI receptionist</h1>
          <p style={{ fontSize: 14, color: '#8899aa' }}>Follow the steps below to add your chatbot to your website. It takes less than 2 minutes.</p>
        </div>

        {/* EMBED CODE */}
        <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 16, padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Your embed code</h2>
            <button
              onClick={handleCopy}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: copied ? 'rgba(52,211,153,0.1)' : '#1e2a3a', border: 'none', borderRadius: 8, fontSize: 12, color: copied ? '#34d399' : '#cdd9e8', cursor: 'pointer' }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy code'}
            </button>
          </div>
          <pre style={{ background: '#0a0a0f', border: '0.5px solid #1e2a3a', borderRadius: 10, padding: 16, fontSize: 12, color: '#60a5fa', fontFamily: 'monospace', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>
            {embedCode}
          </pre>
          <p style={{ fontSize: 11, color: '#8899aa', marginTop: 10 }}>⚠️ This code is unique to your business — don't share it publicly.</p>
        </div>

        {/* PLATFORM TABS */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Choose your platform</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => { setActivePlatform(p.id); setActiveStep(0); setLightboxOpen(false); }}
                style={{
                  padding: '8px 16px', borderRadius: 10,
                  border: activePlatform === p.id ? '2px solid #2563eb' : '0.5px solid #1e2a3a',
                  background: activePlatform === p.id ? 'rgba(37,99,235,0.1)' : '#0d1117',
                  color: activePlatform === p.id ? '#60a5fa' : '#8899aa',
                  fontSize: 13, fontWeight: activePlatform === p.id ? 600 : 400,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span>{p.icon}</span> {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* STEPS */}
        <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #1e2a3a' }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
              {platforms.find(p => p.id === activePlatform)?.icon} Step-by-step for {platforms.find(p => p.id === activePlatform)?.name}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr' }}>
            {/* STEP LIST */}
            <div style={{ borderRight: '0.5px solid #1e2a3a' }}>
              {currentSteps.map((step, i) => (
                <div
                  key={i}
                  onClick={() => { setActiveStep(i); setLightboxOpen(false); }}
                  style={{
                    padding: '14px 20px', cursor: 'pointer',
                    borderBottom: '0.5px solid #1e2a3a',
                    background: activeStep === i ? 'rgba(37,99,235,0.08)' : 'transparent',
                    borderLeft: activeStep === i ? '2px solid #2563eb' : '2px solid transparent',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: activeStep === i ? '#2563eb' : i < activeStep ? 'rgba(52,211,153,0.2)' : '#1e2a3a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: 11, fontWeight: 700,
                    color: activeStep === i ? '#fff' : i < activeStep ? '#34d399' : '#8899aa',
                  }}>
                    {i < activeStep ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: activeStep === i ? '#fff' : '#8899aa', fontWeight: activeStep === i ? 500 : 400, lineHeight: 1.4 }}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>

            {/* STEP DETAIL */}
            <div style={{ padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 300 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {activeStep + 1}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{currentSteps[activeStep].title}</h3>
                </div>
                <p style={{ fontSize: 14, color: '#8899aa', lineHeight: 1.7, marginBottom: 20 }}>
                  {currentSteps[activeStep].description}
                </p>
                {currentSteps[activeStep].highlight && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.1)', border: '0.5px solid rgba(37,99,235,0.3)', borderRadius: 8, padding: '8px 14px', marginBottom: 20 }}>
                    <span style={{ fontSize: 12, color: '#60a5fa' }}>Look for:</span>
                    <code style={{ fontSize: 13, color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}>{currentSteps[activeStep].highlight}</code>
                  </div>
                )}

                {/* SCREENSHOT */}
                {currentImage && (
                  <div
                    onClick={() => setLightboxOpen(true)}
                    style={{ position: 'relative', marginTop: 8, borderRadius: 12, overflow: 'hidden', border: '0.5px solid #1e2a3a', cursor: 'zoom-in' }}
                  >
                    <img
                      src={currentImage}
                      alt={`Step ${activeStep + 1} screenshot`}
                      style={{ width: '100%', display: 'block', imageRendering: 'auto' }}
                    />
                    <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ZoomIn size={12} color="#fff" />
                      <span style={{ fontSize: 11, color: '#fff' }}>Click to expand</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32 }}>
                <button
                  onClick={() => { setActiveStep(Math.max(0, activeStep - 1)); setLightboxOpen(false); }}
                  disabled={activeStep === 0}
                  style={{ padding: '8px 16px', background: '#0a0a0f', border: '0.5px solid #1e2a3a', borderRadius: 8, fontSize: 13, color: '#8899aa', cursor: activeStep === 0 ? 'not-allowed' : 'pointer', opacity: activeStep === 0 ? 0.4 : 1 }}
                >
                  ← Previous
                </button>
                {activeStep < currentSteps.length - 1 ? (
                  <button
                    onClick={() => { setActiveStep(activeStep + 1); setLightboxOpen(false); }}
                    style={{ padding: '8px 20px', background: '#2563eb', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#fff', cursor: 'pointer' }}
                  >
                    Next step →
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(52,211,153,0.1)', border: '0.5px solid rgba(52,211,153,0.3)', borderRadius: 8, padding: '8px 16px' }}>
                    <span style={{ fontSize: 13, color: '#34d399', fontWeight: 500 }}>🎉 All done! Your bot is live.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* HELP */}
        <div style={{ marginTop: 24, padding: '16px 20px', background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 13, color: '#8899aa' }}>Need help? We'll set it up for you for free.</p>
          <a href="https://mail.google.com/mail/?view=cm&to=desklosupport@gmail.com" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#60a5fa', textDecoration: 'none', fontWeight: 500 }}>
            Contact support <ExternalLink size={12} />
          </a>
        </div>

      </div>
    </div>
  );
}