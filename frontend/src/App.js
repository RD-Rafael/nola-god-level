import logo from './logo.svg';
import './App.css';
import MyChart from './components/dashboard';
import MetricCard from './components/metricCard';
import MultipleSelect from './components/storeMultiselect'
import LineGraph from './components/LineGraph'
import NewAnalyticModal from './components/newAnaliticModal'
import { Line } from 'recharts';
import React, { useState, useMemo, useEffect } from 'react';
import { useStoreNames } from './hooks/useStoreNames';
import Stack from '@mui/material/Stack';

function App() {
  const [selectedStores, setSelectedStores] = useState([]);
  const { data, isLoading, error } = useStoreNames();

  const [analytics, setAnalytics] = useState([]);


  //nova métrica
  const handleNewAnalytic = (metricConfig) => {
    setAnalytics((prev) => [
      ...prev,
      { id: Date.now(), ...metricConfig },
    ]);
  };
  //remoção de métrica
  const handleRemoveAnalytic = (id) => {
    setAnalytics((prev) => prev.filter((a) => a.id !== id));
  };

  //FUNÇÕES PARA A SELECTION
  const handleMultiSelectChange = (event) => {
      const {
        target: { value },
      } = event;


    setSelectedStores(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const multiSelectOptions = useMemo(() => {
    if (isLoading || error || !data) {
      return [];
    }

    let result = data.map((store) => ({
      value: 0,
      key: store.name
    }));

    for(let i = 0; i < result.length; i++){
      result[i].value = i;
    }
    return result;
  }, [data, isLoading, error]);
////




  return (
    <div className="App">
      <div
          style={{
          background: '#1e1e1e',
          padding: 16,
          color: 'white',
          minWidth: 180,
          textAlign: 'center',
          position: 'sticky',
          display: 'flex',
        }}
      >
        <NewAnalyticModal
          onConfirm={handleNewAnalytic}
        />
        <MultipleSelect
          selectedStores = {selectedStores}
          options = {multiSelectOptions}
          onChange = {handleMultiSelectChange}
        />
      </div>
      <header className="App-header">
        <Stack direction="row" flexWrap="wrap" spacing={4} justifyContent="left" sx={{ mt: 4 }}>
          {analytics.map((analytic) =>
            analytic.type === 'singular' ? (
              <MetricCard
              key={analytic.id}
              id={analytic.id}
              storeIds={selectedStores}
              metricName={analytic.metric}
              period={analytic.period}
              aggregateFunction={analytic.aggregateFunction}
              count = {analytic.count}
              title = {analytic.title}
              onRemove={handleRemoveAnalytic}
              />
            ) : (
            <LineGraph
              key={analytic.id}
              id={analytic.id}
              selectedStores={selectedStores}
              metric={analytic.metric}
              period={analytic.period}
              count={analytic.count || 30}
              aggregateFunction={analytic.aggregateFunction}
              title = {analytic.title}
              onRemove={handleRemoveAnalytic}
            />
            )
          )}
        </Stack>
      </header>
    </div>
  );
}

export default App;
