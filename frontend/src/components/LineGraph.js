import React, { useMemo } from "react";
import { useMetricData } from "../hooks/useMetricData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function formatMetricValue(metricName, value) {
  if (value == null) return "N/A";

  switch (metricName) {
    case "faturamento":
    case "ticketMedio":
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);

    case "quantidadePedidos":
    case "itensVendidos":
      return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(value);

    case "tempoDeEntrega":
      return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(value);

    default:
      return value.toFixed ? value.toFixed(1) : value;
  }
}

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
    <div style={{ position: "relative", margin: "20px auto" }}>
      {/* Botão de remover */}
      <button
        onClick={() => onRemove(id)}
        style={{
          position: "absolute",
          top: -10,
          right: 5,
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

      <LineChart width={800} height={400} data={data} style={{ maxWidth: 800, margin: "auto" }}>
        <CartesianGrid stroke="#555" strokeDasharray="5 5" />
        <XAxis
          dataKey="value_period"
          tickFormatter={(v) => new Date(v).toLocaleDateString("pt-BR")}
        />
        <YAxis />
        <Tooltip
          formatter={(value) => formatMetricValue(metric, value)}
          labelFormatter={(label) => `Período: ${new Date(label).toLocaleDateString("pt-BR")}`}
        />
        <Legend />
        <Line
          type="monotone"
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
