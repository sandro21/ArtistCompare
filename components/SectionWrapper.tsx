import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  header?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className, header }) => {
  return (
    <div
      style={{
        borderRadius: '1.75rem',
        border: '1px solid #38D985',
        background: 'rgba(0, 0, 0, 0.69)',
        boxShadow: '0 0 18.3px -3px #38D985 inset, 0 0 20.6px -3px #38D985',
      }}
      className={`p-8 w-full max-w-5xl ${className ?? ''}`}
    >
      {header && (
        <div className="font-bold text-2xl text-white mb-6 text-center">{header}</div>
      )}
      {children}
    </div>
  );
};

export default SectionWrapper;
