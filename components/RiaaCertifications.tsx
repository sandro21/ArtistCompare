import React from 'react';
import ComparisonBar from './ComparisonBar';
import SectionWrapper from './SectionWrapper';
import { artists } from '../data/artists';

const RiaaCertifications: React.FC = () => {
  return (
    <SectionWrapper header="Riaa Certifications">
      <ComparisonBar artist1Value={artists[0].riaaCertifications.Gold} artist2Value={artists[1].riaaCertifications.Gold} metric="Gold" />
      <ComparisonBar artist1Value={artists[0].riaaCertifications.Platinum} artist2Value={artists[1].riaaCertifications.Platinum} metric="Platinum" />
      <ComparisonBar artist1Value={artists[0].riaaCertifications.Diamond} artist2Value={artists[1].riaaCertifications.Diamond} metric="Diamond" />
    </SectionWrapper>
  );
};

export default RiaaCertifications;
