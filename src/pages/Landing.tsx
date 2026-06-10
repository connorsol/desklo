import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  UserPlus,
  MessageSquare,
  BarChart3,
  Moon,
  Settings,
  ArrowRight,
  Check,
  Zap,
  Bot,
  Globe,
} from 'lucide-react';

function Banner() {
  return (
    <div className="bg-brand-500 text-white text-center text-sm py-2 px-4 font-medium">
      Founding Member Offer — First 10 customers get locked in at $69/mo forever.{' '}
      <Link to="/onboarding" className="underline hover:no-underline">Claim your spot →</Link>
    </div>
  );
}

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">Desklo</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
          <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Login</Link>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
          >
            Start Free Trial
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-gray-600"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <path d="M5 5l10 10M15 5L5 15" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm text-gray-600 py-1">Features</a>
          <a href="#pricing" className="block text-sm text-gray-600 py-1">Pricing</a>
          <Link to="/login" className="block text-sm text-gray-600 py-1">Login</Link>
          <Link to="/onboarding" className="block text-sm font-medium text-brand-500 py-1">Start Free Trial</Link>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-500 text-xs font-medium mb-6">
          <Zap size={12} />
          24/7 AI Receptionist
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.08] mb-6">
          Never Miss a<br />
          <span className="text-brand-500">Lead Again</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Desklo is a 24/7 AI receptionist that answers questions, captures leads,
          and books appointments — so you don't have to.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
          >
            Start Free Trial
            <ArrowRight size={18} />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-gray-700 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: UserPlus,
      title: 'Sign Up',
      desc: 'Create your account in under 30 seconds. No credit card required to start.',
    },
    {
      num: '02',
      icon: Settings,
      title: 'Train Your Bot in 5 Minutes',
      desc: 'Tell us about your business, services, and hours. Our AI handles the rest.',
    },
    {
      num: '03',
      icon: Globe,
      title: 'Go Live on Your Website',
      desc: 'Add a single line of code and your AI receptionist is ready to work.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-gray-50/80">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-brand-500 mb-2">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Live in 3 simple steps
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="relative bg-white rounded-2xl p-8 border border-gray-100">
              <span className="text-xs font-mono text-brand-400 mb-4 block">{step.num}</span>
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                <step.icon size={20} className="text-brand-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Clock, title: '24/7 Availability', desc: 'Your AI never sleeps, ensuring every visitor gets an instant response.' },
    { icon: UserPlus, title: 'Lead Capture', desc: 'Automatically collect names, emails, and phone numbers from every conversation.' },
    { icon: MessageSquare, title: 'SMS Support', desc: 'Engage leads via text message right from the conversation thread.' },
    { icon: BarChart3, title: 'Monthly ROI Reports', desc: 'See exactly how many leads and bookings your AI generates each month.' },
    { icon: Moon, title: 'After-Hours Coverage', desc: 'Capture leads while you sleep — no more missed after-hours calls.' },
    { icon: Settings, title: 'Done-for-You Setup', desc: "We handle the entire setup so you don't have to lift a finger." },
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-brand-500 mb-2">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Everything you need to capture leads
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-brand-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                <f.icon size={20} className="text-brand-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 99,
      features: ['Chat widget', 'Lead capture', 'Dashboard', 'Monthly reports'],
      popular: false,
    },
    {
      name: 'Pro',
      price: 149,
      features: ['Everything in Starter', 'SMS number', 'Voice calls', 'After-hours alerts', 'Priority support'],
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-gray-50/80">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-brand-500 mb-2">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Simple, transparent pricing
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gray-900 text-white ring-2 ring-brand-500'
                  : 'bg-white border border-gray-100'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-8 px-3 py-1 text-xs font-medium bg-brand-500 text-white rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className={`text-lg font-semibold mb-1 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  ${plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check size={16} className={plan.popular ? 'text-brand-400' : 'text-brand-500'} />
                    <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/onboarding"
                className={`block w-full py-2.5 text-center text-sm font-medium rounded-lg transition-colors ${
                  plan.popular
                    ? 'bg-brand-500 text-white hover:bg-brand-600'
                    : 'bg-brand-500 text-white hover:bg-brand-600'
                }`}
              >
                Start Free Trial
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-brand-500 flex items-center justify-center">
            <Bot size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900">Desklo</span>
        </div>
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Desklo. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Banner />
      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
