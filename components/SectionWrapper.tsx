import type { SharePayload } from '../types';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  header?: string;
  headerClassName?: string;
  sharePayload?: SharePayload;
  onShare?: (payload: SharePayload) => void;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  className,
  header,
  headerClassName,
  sharePayload,
  onShare,
}) => {
  const canShare = !!sharePayload && !!onShare;

  return (
    <div
      style={{
        borderRadius: '3rem',
        border: '4px solid rgba(94, 233, 182, 0.42)',
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 80%, rgba(94, 233, 181, 0.15) 110%)',
        boxShadow: '0 0 30px -17px rgba(94, 233, 181, 0.83) inset, 0 0 30px -8px rgba(94, 233, 181, 0.74)',
        position: 'relative',
      }}
      className={`px-4 py-5 sm:px-8 w-full max-w-3xl ${className ?? ''}`}
    >
      {/* Share button — only rendered when a payload is supplied */}
      {canShare && (
        <button
          onClick={() => onShare(sharePayload!)}
          aria-label="Share this section"
          className="absolute top-4 right-4 flex items-center justify-center transition-opacity duration-150"
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.40)',
            cursor: 'pointer',
            padding: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(94,233,181,0.15)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(94,233,181,0.50)';
            (e.currentTarget as HTMLButtonElement).style.color = '#5EE9B5';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.40)';
          }}
        >
          {/* Upload / share arrow icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v7M4.5 3.5L7 1l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.5 9v2A1.5 1.5 0 004 12.5h6A1.5 1.5 0 0011.5 11V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}

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
