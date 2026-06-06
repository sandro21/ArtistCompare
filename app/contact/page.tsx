import { Metadata } from 'next';
import LegalPage, { LegalSection } from '../../components/LegalPage';

export const metadata: Metadata = {
  title: 'Contact | Artist Compare',
  description: 'Get in touch with the Artist Compare team for questions, feedback, data corrections, or partnership inquiries.',
  alternates: { canonical: '/contact' },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <LegalPage
      badge="Contact"
      title="Contact Us"
      subtitle="We'd love to hear from you."
    >
      <LegalSection heading="Get in touch">
        <p>
          Have a question, found a data error, or want to discuss a partnership? Reach out and we’ll
          get back to you as soon as we can.
        </p>
        <p>
          Email:{' '}
          <a href="mailto:support@artistcompare.com" className="text-[#5EE9B5] underline">
            support@artistcompare.com
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="What to include">
        <ul className="list-disc pl-6 space-y-1">
          <li>A clear subject line (e.g., “Data correction”, “Partnership”, “Feedback”).</li>
          <li>The artist(s) or page involved, if reporting an issue.</li>
          <li>Any details that help us understand and resolve your request.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Partnerships & affiliates">
        <p>
          For partnership, advertising, or affiliate inquiries, email us at the address above with
          “Partnership” in the subject line. Learn more about how we work with partners in our{' '}
          <a href="/affiliate-disclosure" className="text-[#5EE9B5] underline">Affiliate Disclosure</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
