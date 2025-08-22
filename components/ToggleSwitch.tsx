import React from 'react';

interface ToggleSwitchProps {
  leftLabel: string;
  rightLabel: string;
  isLeft: boolean;
  onToggle: (isLeft: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  leftLabel, 
  rightLabel, 
  isLeft, 
  onToggle 
}) => {
  return (
    <div className="flex items-center justify-center mb-8">
    <div 
      className="relative rounded-full p-1.5" 
      style={{
        width: '9.375rem',
        height: '1.875rem',
        flexShrink: 0,
        background: '#12261266',
        boxShadow: '0 0 10px -0px rgba(56,217,133,0.9), 0 4px 10px rgba(0,0,0,0.35)'
      }}
    >
      {/* Button labels */}
      <div className="relative flex h-full z-20">
        <button
        onClick={() => onToggle(true)}
    className="flex-1 text-white text-sm font-regular transition-all duration-300 flex items-center justify-center pr-1 ml-1"
        >
        {leftLabel}
        </button>
        <button
        onClick={() => onToggle(false)}
  className="flex-1 text-white text-sm font-regular transition-all duration-300 flex items-center justify-center pl-0 -ml-1 -mt-0.5"
        >
        {rightLabel}
        </button>
      </div>
      
      {/* Moving oval - positioned behind text */}
      <div 
        className="absolute top-1/2 rounded-full z-10"
        style={{
          width: '4.5rem',
          height: '1.25rem',
          borderRadius: '1.5rem',
          background: 'linear-gradient(30deg, #3b844ca9, #218564d6)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.12), 0 2px 4px rgba(0,0,0,0.35)',
          left: '6px',
          transform: `translate3d(${isLeft ? '0' : '66px'}, -50%, 0)`,
          transition: 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform'
        }}
      />
    </div>
    </div>
  );
};

export default ToggleSwitch;
