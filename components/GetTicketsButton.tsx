import React from 'react';
import { track } from '@vercel/analytics';

interface GetTicketsButtonProps {
  href: string;
  artistName: string;
  eventCount?: number;
}

const TicketIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="flex-shrink-0"
  >
    <path d="M3 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
    <path d="M13 5v14" />
  </svg>
);

const GetTicketsButton: React.FC<GetTicketsButtonProps> = ({ href, artistName, eventCount }) => {
  const label = eventCount && eventCount > 1 ? `Get Tickets · ${eventCount} shows` : 'Get Tickets';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() => track('get_tickets_click', { artist: artistName })}
      className="inline-flex items-center gap-1.5 mb-2 sm:mb-3 px-3 py-1 sm:px-4 sm:py-1.5
                 rounded-full text-xs sm:text-sm font-bold
                 bg-[#5EE9B5] text-[#0C1919]
                 transition-colors duration-150 motion-reduce:transition-none
                 hover:bg-[#38D985]
                 active:bg-[#2bbf72]
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5EE9B5] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{ boxShadow: '0 0 4px 0 #38D985 inset, 0 0 2.6px 1px #38D985' }}
    >
      <TicketIcon />
      {label}
    </a>
  );
};

export default GetTicketsButton;
