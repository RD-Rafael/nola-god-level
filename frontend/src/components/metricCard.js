import React from 'react';
import { useMetricData } from '../hooks/useMetricData'; // Import the custom hook
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatMetricValue } from '../utils/formatMetricValueUtil';






function MetricCard({ count, id, storeIds, metricName, period, aggregateFunction, onRemove }) {
    const params ={
      period: period,
      count: count,
      valueType: metricName,
      aggregateFunction,
      storeList: storeIds,
      metricType: "singular"
    }

    
    const { data, isLoading, error } = useMetricData(params);

    if (isLoading) return <div>Carregando Métrica...</div>;
    if (error) return <div>ERROR: {error}</div>;

    let metricValue = 'N/A'
    if(data && data.length > 0){
      metricValue = formatMetricValue(metricName, Number(data[0].value));
    }

    return (
      <div
        style={{
          background: '#1e1e1e',
          borderRadius: 12,
          padding: 16,
          color: 'white',
          minWidth: 180,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <button
          onClick={() => onRemove(id)}
          style={{
            position: 'absolute',
            top: 6,
            right: 10,
            background: 'transparent',
            border: 'none',
            color: '#ff5555',
            fontSize: 18,
            cursor: 'pointer',
          }}
          title="Remover"
        >
          ✕
        </button>

        <h3>{metricName}</h3>
        <div style={{ fontSize: 20, fontWeight: 'bold' }}>{isLoading ? 'Carregando...' : metricValue}</div>
        period: {period}<h1></h1>
        count: {count}<h1></h1>
        valueType: {metricName}<h1></h1>
        aggregateFunction: {aggregateFunction}<h1></h1>
        storeList: {storeIds}<h1></h1>
      </div>
    );
}

export default MetricCard