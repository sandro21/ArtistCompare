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
      <ComparisonBar 
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
      />
    </SectionWrapper>
  );
};

export default RiaaCertifications;
