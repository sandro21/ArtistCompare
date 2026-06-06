import { Metadata } from 'next';
import LegalPage, { LegalSection } from '../../components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy | Artist Compare',
  description:
    'How Artist Compare collects, uses, and protects information, including analytics, cookies, and third-party services.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      badge="Privacy"
      title="Privacy Policy"
      subtitle="What we collect, how we use it, and your choices."
      lastUpdated="June 6, 2026"
    >
      <LegalSection heading="Overview">
        <p>
          Artist Compare (“we”, “us”, “our”) respects your privacy. This policy explains what
          information we collect when you use our website and how we handle it. You can use Artist
          Compare without creating an account or providing personal information.
        </p>
      </LegalSection>

      <LegalSection heading="Information we collect">
        <p>We do not require registration and do not ask for personal details to use the site. We may collect:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Usage and analytics data:</strong> anonymized information such as pages visited,
            general device/browser type, and aggregated interaction events, via privacy-friendly
            analytics.
          </li>
          <li>
            <strong>Search queries:</strong> the artist names you compare, used to operate and
            improve the comparison features.
          </li>
          <li>
            <strong>Community votes:</strong> if you vote in a matchup, we store the aggregate vote
            counts. Votes are not tied to your identity.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Cookies and tracking">
        <p>
          We and our partners may use cookies and similar technologies for analytics and for
          affiliate attribution. When you click an affiliate link (for example, a “Get Tickets”
          link), the partner network may set a cookie to credit a resulting purchase. You can
          control or disable cookies through your browser settings.
        </p>
      </LegalSection>

      <LegalSection heading="Third-party services">
        <p>
          We rely on third-party data sources and services to operate, including Spotify, Billboard
          chart data, Google Trends, SeatGeek, and affiliate networks such as Impact.com. When you
          interact with their content or links, their own privacy policies apply. We encourage you
          to review them.
        </p>
      </LegalSection>

      <LegalSection heading="How we use information">
        <p>We use the information described above to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>operate, maintain, and improve the website and its features;</li>
          <li>understand which comparisons and features are most useful;</li>
          <li>attribute qualifying purchases through affiliate links; and</li>
          <li>protect against abuse and ensure the service works reliably.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Data sharing">
        <p>
          We do not sell your personal information. Aggregated, anonymized data may be processed by
          our analytics and infrastructure providers solely to operate the service.
        </p>
      </LegalSection>

      <LegalSection heading="Children’s privacy">
        <p>
          Artist Compare is not directed to children under 13, and we do not knowingly collect
          personal information from them.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <p>
          We may update this policy from time to time. Material changes will be reflected by the
          “Last updated” date above.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about this policy? Email{' '}
          <a href="mailto:support@artistcompare.com" className="text-[#5EE9B5] underline">
            support@artistcompare.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
