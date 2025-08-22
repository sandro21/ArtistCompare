interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  header?: string;
  headerClassName?: string; // ✅ new
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  children, 
  className, 
  header, 
  headerClassName 
}) => {
  return (
    <div
      style={{
        borderRadius: '1.75rem',
        border: '1px solid #38D985',
        background: 'rgba(0, 0, 0, 0.69)',
        boxShadow: '0 0 18.3px -3px #38D985 inset, 0 0 20.6px -3px #38D985',
      }}
      className={`p-8 w-full max-w-3xl ${className ?? ''}`}
    >
      {header && (
        <div className={`font-bold text-2xl text-white text-center ${headerClassName ?? 'mb-6'}`}>
          {header}
        </div>
      )}
      {children}
    </div>
  );
};

export default SectionWrapper;
