import React from 'react';

interface SourceAttributionProps {
  children: React.ReactNode;
  href?: string;
}

const SourceAttribution: React.FC<SourceAttributionProps> = ({ children, href }) => (
  <div className="text-[#5EE9B5] text-xs font-semibold tracking-wide mt-1 text-center w-full sm:text-left">
    {href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">
        {children}
      </a>
    ) : (
      children
    )}
  </div>
);

export default SourceAttribution;
