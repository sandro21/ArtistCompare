import React from 'react';

interface SourceAttributionProps {
  children: React.ReactNode;
}

const SourceAttribution: React.FC<SourceAttributionProps> = ({ children }) => (
  <div className="text-[#5EE9B5] text-xs font-semibold tracking-wide mt-1 text-center w-full sm:text-left">
    {children}
  </div>
);

export default SourceAttribution;
