import React, { useMemo } from "react";
import { useMetricData } from "../hooks/useMetricData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function LineGraph({ selectedStores, period, count, aggregateFunction }) {
  // Memoize params so they don't change reference on every render
  const params = useMemo(() => ({
    period,
    count,
    aggregateFunction,
    storeList: selectedStores
  }), [period, count, aggregateFunction, selectedStores]);

  const { data, isLoading, error } = useMetricData(params);

  if (isLoading) return <h3>Loading...</h3>;
  if (error) return <h3>Error loading data</h3>;
  if (!data) return <h3>No data</h3>;

  return (
    <LineChart
      width={800}
      height={400}
      data={data}
      style={{ maxWidth: 800, margin: "auto" }}
    >
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey="value_period" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  );
}
