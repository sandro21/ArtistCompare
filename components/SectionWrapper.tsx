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
        borderRadius: '3rem',
        border: '1px solid #38D985',
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(65, 147, 105, 0.24) 110%)',
        boxShadow: '0 0 30px -17px rgba(56, 217, 134, 0.83) inset, 0 0 30px -8px rgba(56, 217, 134, 0.74)',
      }}
      className={`px-4 py-5 sm:px-8 w-full max-w-3xl`}
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
