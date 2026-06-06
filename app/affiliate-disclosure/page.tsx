import { Metadata } from 'next';
import LegalPage, { LegalSection } from '../../components/LegalPage';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | Artist Compare',
  description:
    'How Artist Compare uses affiliate links, including ticket links, and how we earn commissions at no extra cost to you.',
  alternates: { canonical: '/affiliate-disclosure' },
  robots: { index: true, follow: true },
};

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage
      badge="Disclosure"
      title="Affiliate Disclosure"
      subtitle="Transparency about how Artist Compare earns money."
      lastUpdated="June 6, 2026"
    >
      <LegalSection heading="The short version">
        <p>
          Artist Compare is free to use. To help cover our costs, some links on this site are
          affiliate links. If you click one and make a purchase, we may earn a commission — at
          no additional cost to you.
        </p>
      </LegalSection>

      <LegalSection heading="Affiliate relationships">
        <p>
          Artist Compare is a participant in affiliate and partner programs, including affiliate
          networks such as Impact.com and ticketing partners such as SeatGeek. These programs
          allow us to earn fees by linking to partner sites.
        </p>
        <p>
          When an artist has upcoming shows, we may display a “Get Tickets” link that directs you
          to a partner like SeatGeek. If you purchase tickets after following one of these links,
          we may receive a commission on that sale.
        </p>
      </LegalSection>

      <LegalSection heading="How this affects you">
        <p>
          Affiliate commissions never change the price you pay. We do not add any markup. Our
          comparisons, statistics, and rankings are based on data from third-party sources and are
          not influenced by affiliate relationships.
        </p>
        <p>
          We only link to partners we believe provide genuine value to our visitors. The presence
          of an affiliate link is not an endorsement of any specific event, seller, or price.
        </p>
      </LegalSection>

      <LegalSection heading="Your choice">
        <p>
          Using affiliate links is entirely optional. You are always free to navigate to any
          partner site directly without using our links.
        </p>
      </LegalSection>

      <LegalSection heading="Questions">
        <p>
          If you have any questions about our affiliate relationships, contact us at{' '}
          <a href="mailto:support@artistcompare.com" className="text-[#5EE9B5] underline">
            support@artistcompare.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
