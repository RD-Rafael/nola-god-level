import React from 'react';
import { useMetricData } from '../hooks/useMetricData'; // Import the custom hook
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function MyChart() {
  // Call the hook to get the state
  const { data, isLoading, error } = useMetricData();

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>ERROR: {error}</div>;

  return (
    <div>
      <h1>My Dashboard</h1>
      <BarChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="value_period" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
    </div>
  );
}

export default MyChart