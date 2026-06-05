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
          className="absolute bottom-4 left-5 flex items-center gap-1.5 transition-all duration-150"
          style={{
            height: 26,
            borderRadius: '2rem',
            background: 'rgba(94,233,181,0.08)',
            border: '1px solid rgba(94,233,181,0.38)',
            color: '#5EE9B5',
            cursor: 'pointer',
            padding: '0 10px 0 8px',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(94,233,181,0.16)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(94,233,181,0.60)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(94,233,181,0.08)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(94,233,181,0.38)';
          }}
        >
          {/* Share-nodes icon — three connected circles */}
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="10.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="10.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <line x1="3.8" y1="5.8" x2="9.2" y2="3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="3.8" y1="7.2" x2="9.2" y2="9.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.03em', lineHeight: 1 }}>
            Share
          </span>
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
