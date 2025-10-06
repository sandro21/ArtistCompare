'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  date: string;
  [key: string]: string | number;
}

interface TrendChartProps {
  data: TrendData[];
  artistA: string;
  artistB: string;
}

export default function TrendChart({ data, artistA, artistB }: TrendChartProps) {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            label={{ value: 'Search Interest', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6B7280' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={artistA} 
            stroke="#3B82F6" 
            strokeWidth={3}
            name={artistA}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey={artistB} 
            stroke="#EF4444" 
            strokeWidth={3}
            name={artistB}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}