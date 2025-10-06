'use client';

import { useState, useEffect } from 'react';
import TrendChart from '../../components/TrendChart';

export default function TestChart() {
  const [apiData, setApiData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data as fallback
  const mockData = [
    { date: 'Jan 2020', Drake: 45, 'Kanye West': 38 },
    { date: 'Feb 2020', Drake: 52, 'Kanye West': 41 },
    { date: 'Mar 2020', Drake: 48, 'Kanye West': 44 },
    { date: 'Apr 2020', Drake: 55, 'Kanye West': 39 },
    { date: 'May 2020', Drake: 49, 'Kanye West': 42 },
    { date: 'Jun 2020', Drake: 53, 'Kanye West': 40 },
    { date: 'Jul 2020', Drake: 47, 'Kanye West': 43 },
    { date: 'Aug 2020', Drake: 51, 'Kanye West': 37 },
    { date: 'Sep 2020', Drake: 46, 'Kanye West': 45 },
    { date: 'Oct 2020', Drake: 54, 'Kanye West': 41 },
    { date: 'Nov 2020', Drake: 50, 'Kanye West': 38 },
    { date: 'Dec 2020', Drake: 48, 'Kanye West': 44 },
  ];

  const fetchApiData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing API call...');
      const response = await fetch('/api/google-trends?a=Lil%20Durk&b=NBA%20YoungBoy&range=all');
      const result = await response.json();
      
      console.log('API Response:', result);
      
      if (result.ok && result.data) {
        setApiData(result.data);
        console.log('API data set:', result.data.length, 'points');
      } else {
        setError(result.error || 'API failed');
        console.log('API error:', result.error);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiData();
  }, []);

  return (
    <div className="p-8 bg-black min-h-screen">
      <h1 className="text-white text-2xl mb-6">Chart Test Page</h1>
      
      <div className="mb-6">
        <button 
          onClick={fetchApiData}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Loading...' : 'Test API Again'}
        </button>
        {error && <div className="text-red-500 mt-2">Error: {error}</div>}
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-white text-xl mb-4">API Data Chart</h2>
        {loading ? (
          <div className="text-gray-500">Loading API data...</div>
        ) : apiData.length > 0 ? (
          <div>
            <div className="text-white mb-4">
              <p>Data points: {apiData.length}</p>
              <p>First point: {JSON.stringify(apiData[0])}</p>
              <p>Last point: {JSON.stringify(apiData[apiData.length - 1])}</p>
            </div>
            <TrendChart 
              data={apiData} 
              artistA="Lil Durk" 
              artistB="NBA YoungBoy" 
            />
          </div>
        ) : (
          <div className="text-gray-500">No API data available</div>
        )}
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-white text-xl mb-4">Mock Data Chart</h2>
        <TrendChart 
          data={mockData} 
          artistA="Drake" 
          artistB="Kanye West" 
        />
      </div>
      
      <div className="text-white">
        <h3 className="text-lg mb-2">API Data ({apiData.length} points):</h3>
        <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto max-h-96">
          {JSON.stringify(apiData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
