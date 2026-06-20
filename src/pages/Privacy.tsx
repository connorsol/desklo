import { Link } from 'react-router-dom';
import { Bot, ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <header style={{ height: 56, borderBottom: '0.5px solid #1e2a3a', background: 'rgba(10,10,15,0.95)', display: 'flex', alignItems: 'center', padding: '0 24px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="#fff" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Desklo</span>
          </Link>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#8899aa', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back home
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px', color: '#cdd9e8', lineHeight: 1.7, fontSize: 14 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 12, color: '#8899aa', marginBottom: 32 }}>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <Section title="1. Introduction">
          Desklo ("we", "us", "our") provides an AI-powered receptionist chat widget for businesses ("Service"). This Privacy Policy explains how we collect, use, and protect information when you use our website, dashboard, and chat widget.
        </Section>

        <Section title="2. Information We Collect">
          <strong>Account information:</strong> When you sign up, we collect your email address and authentication details via Supabase.<br /><br />
          <strong>Business information:</strong> Business name, services, hours, pricing, and other details you provide to configure your AI receptionist.<br /><br />
          <strong>Conversation data:</strong> Messages exchanged between your website visitors and your AI receptionist, including any contact information visitors voluntarily provide (name, email, phone number).<br /><br />
          <strong>Usage data:</strong> Basic analytics such as conversation counts, timestamps, and feature usage within your dashboard.
        </Section>

        <Section title="3. How We Use Information">
          We use collected information to operate and improve the Service, including: powering your AI receptionist's responses, displaying conversation history and analytics in your dashboard, processing payments, sending account-related emails, and providing customer support.
        </Section>

        <Section title="4. Third-Party Services">
          We rely on the following third-party providers to operate Desklo: Supabase (database and authentication), Groq (AI language model processing), Cloudflare (hosting and infrastructure), and Stripe (payment processing, once enabled). These providers process data on our behalf and maintain their own privacy and security standards.
        </Section>

        <Section title="5. Data Sharing">
          We do not sell your personal information or your customers' conversation data to third parties. We only share data with the service providers listed above as necessary to operate Desklo, or if required by law.
        </Section>

        <Section title="6. Data Security">
          We use industry-standard measures to protect your data, including encrypted connections (HTTPS), database access controls (Row Level Security), and secure API authentication. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
        </Section>

        <Section title="7. Data Retention">
          We retain your account and conversation data for as long as your account remains active. If you delete your account, your business data and associated conversations are permanently deleted from our systems.
        </Section>

        <Section title="8. Your Rights">
          You may access, update, or delete your business information at any time through your dashboard Settings page. You may request a copy of your data or full account deletion by contacting us at the email below.
        </Section>

        <Section title="9. Children's Privacy">
          Desklo is not intended for use by individuals under 18. We do not knowingly collect information from children.
        </Section>

        <Section title="10. Changes to This Policy">
          We may update this Privacy Policy from time to time. Material changes will be reflected by updating the "Last updated" date above.
        </Section>

        <Section title="11. Contact Us">
          If you have questions about this Privacy Policy, contact us at{' '}
          <a href="mailto:desklosupport@gmail.com" style={{ color: '#60a5fa' }}>desklosupport@gmail.com</a>.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{title}</h2>
      <p style={{ color: '#8899aa' }}>{children}</p>
    </div>
  );
}