import logo from './logo.svg';
import './App.css';
import MyChart from './components/dashboard';
import MetricCard from './components/metricCard';
import MultipleSelect from './components/storeMultiselect'
import LineGraph from './components/LineGraph'
import BasicModal from './components/newAnaliticModal'
import { Line } from 'recharts';
import React, { useState, useMemo, useEffect } from 'react';
import { useStoreNames } from './hooks/useStoreNames';
import Stack from '@mui/material/Stack';

function App() {
  const [selectedStores, setSelectedStores] = useState([]);
  const { data, isLoading, error } = useStoreNames();

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
      <header className="App-header">
        <BasicModal></BasicModal>
        <MultipleSelect
          selectedStores = {selectedStores}
          options = {multiSelectOptions}
          onChange = {handleMultiSelectChange}
        />
        <Stack direction="row" spacing={10}>
          <MetricCard 
            storeIds={selectedStores}
            metricName="Faturamento"
            period="week"
          />
          <MetricCard 
            storeIds={selectedStores}
            metricName="Faturamento"
            period="day"
          />
        </Stack>

        <LineGraph
          selectedStores = {selectedStores}
          period = "day"
          count = "365"
          aggregateFunction = {"count"}
        />
      </header>
    </div>
  );
}

export default App;
