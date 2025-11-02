import React, { useMemo } from "react";
import { useMetricData } from "../hooks/useMetricData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { formatMetricValue } from "../utils/formatMetricValueUtil";

export default function LineGraph({
  id,
  selectedStores,
  metric,
  period,
  count,
  aggregateFunction,
  onRemove,
  title,
}) {
  // Parâmetros enviados à API
  const params = useMemo(
    () => ({
      period,
      count,
      aggregateFunction,
      storeList: selectedStores,
      valueType: metric,
      metricType: "graph",
    }),
    [period, count, aggregateFunction, selectedStores, metric]
  );

  const { data, isLoading, error } = useMetricData(params);

  if (isLoading) return <h3>Carregando gráfico...</h3>;
  if (error) return <h3>Erro ao carregar dados</h3>;
  if (!data) return <h3>Sem dados</h3>;

  return (
    <div 
    style={{ 
      position: "relative", 
      marginLeft: "1rem" ,
      marginTop: "1rem",
      background: '#1e1e1e',
      borderRadius: 12,
      padding: 16,
      color: 'white',
      minWidth: 180,
      textAlign: 'center',
      position: 'relative',
      
    }}>
      {/* Botão de remover */}
      <button
        onClick={() => onRemove(id)}
        style={{
          position: "absolute",
          top: 5,
          right: 10,
          background: "transparent",
          border: "none",
          color: "#ff5555",
          fontSize: 18,
          cursor: "pointer",
          zIndex: 10,
        }}
        title="Remover"
      >
        ✕
      </button>

      <h3 style={{ marginBottom: 10, color: "#ddd" }}>
        {title}
      </h3>

      <LineChart width={800} height={400} data={data} style={{ maxWidth: 800 }}>
        <CartesianGrid stroke="#555" strokeDasharray="5 5" />
        <XAxis
          dataKey="value_period"
          tickFormatter={(v) => new Date(v).toLocaleDateString("pt-BR")}
        />
        <YAxis />
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'rgba(30, 30, 30, 0.9)', // Fundo escuro
            borderColor: '#555',                    // Borda sutil
            borderRadius: 8,
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
          formatter={(value) => formatMetricValue(metric, value)}
        />
        <Legend />
        <Line
          name={title}
          dataKey="value"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </div>
  );
}
