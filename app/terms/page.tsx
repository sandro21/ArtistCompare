import { Metadata } from 'next';
import LegalPage, { LegalSection } from '../../components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service | Artist Compare',
  description:
    'The terms and conditions for using Artist Compare, including data accuracy, affiliate links, and limitation of liability.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      badge="Legal"
      title="Terms of Service"
      subtitle="The rules for using Artist Compare."
      lastUpdated="June 6, 2026"
    >
      <LegalSection heading="Acceptance of terms">
        <p>
          By accessing or using Artist Compare, you agree to these Terms of Service. If you do not
          agree, please do not use the site.
        </p>
      </LegalSection>

      <LegalSection heading="Use of the service">
        <p>
          Artist Compare is provided for personal, non-commercial use. You agree not to misuse the
          service, including by attempting to disrupt it, scrape it at scale, or access it through
          automated means that place an unreasonable load on our systems.
        </p>
      </LegalSection>

      <LegalSection heading="Data accuracy">
        <p>
          We aggregate data from third-party sources such as Spotify, Billboard, Google Trends, and
          ticketing partners. While we strive for accuracy, we do not guarantee that any statistic,
          ranking, tour status, or comparison is complete, current, or error-free. All content is
          provided “as is” for informational and entertainment purposes.
        </p>
      </LegalSection>

      <LegalSection heading="Affiliate links and third-party sites">
        <p>
          The site contains affiliate links, including ticket links to partners such as SeatGeek.
          We may earn a commission on qualifying purchases. We do not control third-party sites and
          are not responsible for their content, pricing, availability, or transactions. Your
          purchases from partners are governed by their terms and policies. See our{' '}
          <a href="/affiliate-disclosure" className="text-[#5EE9B5] underline">Affiliate Disclosure</a>.
        </p>
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <p>
          Artist names, logos, trademarks, and chart data referenced on the site belong to their
          respective owners. Artist Compare claims no ownership over third-party trademarks or data
          and uses them for identification and informational purposes only.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          To the fullest extent permitted by law, Artist Compare and its operators are not liable
          for any indirect, incidental, or consequential damages arising from your use of the site,
          reliance on its data, or transactions with third-party partners.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to these terms">
        <p>
          We may revise these terms at any time. Continued use of the site after changes constitutes
          acceptance of the updated terms.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about these terms? Email{' '}
          <a href="mailto:support@artistcompare.com" className="text-[#5EE9B5] underline">
            support@artistcompare.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
