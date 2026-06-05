import React from 'react';
import ComparisonBar from '../../components/ComparisonBar';
import SectionWrapper from '../../components/SectionWrapper';
import { useMusicMetrics } from '../../hooks/useMusicMetrics';
import { parseMetricValue } from '../../lib/utils/formatters';
import { getArtistName } from '../../lib/utils/artist';
import type { Artist } from '../../types';

interface StreamsProps {
  artistA: Artist | null;
  artistB: Artist | null;
}

const Streams: React.FC<StreamsProps> = ({ artistA, artistB }) => {
  const { metrics: metricsA, loading: loadingA, error: errorA } = useMusicMetrics(getArtistName(artistA), artistA?.spotifyId);
  const { metrics: metricsB, loading: loadingB, error: errorB } = useMusicMetrics(getArtistName(artistB), artistB?.spotifyId);

  if (!artistA || !artistB) {
    return (
      <SectionWrapper header="Streams">
        <div className="text-center text-gray-400 py-8">
          Select two artists to compare their streaming metrics
        </div>
      </SectionWrapper>
    );
  }

  if (loadingA || loadingB) {
    return (
      <SectionWrapper header="Streams">
        <div className="text-center py-8">
          <div className="text-[#5EE9B5] text-lg font-semibold mb-2">
            ⚡ Quick! Try guessing the winner while this loads...
          </div>
          <div className="text-gray-400 text-sm">
            Loading streaming metrics...
          </div>
        </div>
      </SectionWrapper>
    );
  }

  if (errorA || errorB) {
    return (
      <SectionWrapper header="Streams">
        <div className="text-center py-8">
          <div className="text-[#5EE9B5] text-lg font-semibold mb-2">
            Streaming stats unavailable right now
          </div>
          <div className="text-gray-400 text-sm">
            Check out the other sections below! 👇
          </div>
        </div>
      </SectionWrapper>
    );
  }

  if (!metricsA || !metricsB) {
    return (
      <SectionWrapper header="Streams">
        <div className="text-center text-gray-400 py-8">
          No streaming data available
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper header="Streams">
      <ComparisonBar
        artist1Value={parseMetricValue(metricsA.totalStreams)}
        artist2Value={parseMetricValue(metricsB.totalStreams)}
        metric="All-Time Streams"
        labelClassName="max-w-[120px] sm:max-w-[140px] md:max-w-none"
        artist1Rank={metricsA.streamRank}
        artist2Rank={metricsB.streamRank}
      />
      <ComparisonBar
        artist1Value={parseMetricValue(metricsA.monthlyListeners)}
        artist2Value={parseMetricValue(metricsB.monthlyListeners)}
        metric="Monthly Listeners"
        artist1Rank={metricsA.monthlyListenersRank}
        artist2Rank={metricsB.monthlyListenersRank}
      />
      <ComparisonBar
        artist1Value={parseMetricValue(metricsA.followers)}
        artist2Value={parseMetricValue(metricsB.followers)}
        metric="Spotify Followers"
        labelClassName="max-w-[120px] sm:max-w-[140px] md:max-w-none"
      />
    </SectionWrapper>
  );
};

export default Streams;
