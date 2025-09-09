import React from 'react';
import ComparisonBar from './ComparisonBar';
import SectionWrapper from './SectionWrapper';

interface RiaaCertificationsProps {
  artistA: any;
  artistB: any;
}

const RiaaCertifications: React.FC<RiaaCertificationsProps> = ({ artistA, artistB }) => {
  return (
    <SectionWrapper header="Riaa Certifications">
      {/* <ComparisonBar 
        artist1Value={artistA?.riaaCertifications?.Gold || 0} 
        artist2Value={artistB?.riaaCertifications?.Gold || 0} 
        metric="Gold" 
      />
      <ComparisonBar 
        artist1Value={artistA?.riaaCertifications?.Platinum || 0} 
        artist2Value={artistB?.riaaCertifications?.Platinum || 0} 
        metric="Platinum" 
      />
      <ComparisonBar 
        artist1Value={artistA?.riaaCertifications?.Diamond || 0} 
        artist2Value={artistB?.riaaCertifications?.Diamond || 0} 
        metric="Diamond" 
      /> */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '10rem',
        }}
      >
        <span
          style={{
            fontSize: '3.5rem',
            fontWeight: 600,
            color: '#10b981', // Use a single green color from your palette
            display: 'inline-block',
          }}
        >
          Coming Soon...
        </span>
      </div>
    </SectionWrapper>
  );
};

export default RiaaCertifications;
