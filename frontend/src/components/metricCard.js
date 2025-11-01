import React from 'react';
import { useMetricData } from '../hooks/useMetricData'; // Import the custom hook
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function MetricCard({ metricName, period }) {
    const params ={
      period: period,
      count: 1
    }

    
    const { data, isLoading, error } = useMetricData(params);

    if (isLoading) return <div>Carregando Métrica...</div>;
    if (error) return <div>ERROR: {error}</div>;

    let metricValue = 'N/A'
    if(data && data.length > 0){
        metricValue = currencyFormatter.format(data[0].value)
    }

    return (
        <div>
        <h3>
            { metricName }
        </h3>
        { metricValue }

        </div>
    );
}

export default MetricCard