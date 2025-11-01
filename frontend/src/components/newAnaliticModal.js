
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import BasicSelect from './basicSelect';
import BasicButton from './basicButton';












const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

// --- Configurações suportadas pelo backend ---
const metricOptions = [
  { key: 'Faturamento', value: 'faturamento' },
  { key: 'Quantidade de Pedidos', value: 'quantidadePedidos' },
  { key: 'Itens Vendidos', value: 'itensVendidos' },
  { key: 'Tempo de Entrega', value: 'tempoDeEntrega' },
  { key: 'Ticket Médio', value: 'ticketMedio' },
  
];

const optionMetric = [
    {key: 'faturamento', value: 'Faturamento'},
    {key: 'quantidadePedidos', value: 'Quantidade de Pedidos'},
    {key: 'itensVendidos', value: 'Itens Vendidos'},
    {key: 'tempoDeEntrega', value: 'Tempo de Entrega'},
    {key: 'ticketMedio', value: 'Ticket Médio'},
];

const optionMetricMap = optionMetric.reduce((acc, current) => {
    acc[current.key] = current.value;
    return acc;
}, {});

const aggregationOptionsByMetric = {
  faturamento: ['sum'],
  quantidadePedidos: ['sum', 'avg'],
  itensVendidos: ['sum', 'avg'],
  tempoDeEntrega: ['avg'],
  ticketMedio: ['avg'], // derivada, sem agregação
};

const periodOptions = [
  { key: 'Dia', value: 'day' },
  { key: 'Semana', value: 'week' },
  { key: 'Mês', value: 'month' },
  { key: 'Trimestre', value: 'quarter' },
];

export default function NewAnalyticModal({ onConfirm }) {
  const [open, setOpen] = React.useState(false);
  const [metricType, setMetricType] = React.useState('singular'); // 'singular' ou 'graph'
  const [metricName, setMetricName] = React.useState('');
  const [aggregation, setAggregation] = React.useState('');
  const [period, setPeriod] = React.useState('month');
  const [periodCount, setPeriodCount] = React.useState(30);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Opções de agregação dinâmicas conforme métrica
  const availableAggregations = React.useMemo(() => {
    if (!metricName) return [];
    return aggregationOptionsByMetric[metricName] || [];
  }, [metricName]);


  React.useEffect(() => {
  const options = aggregationOptionsByMetric[metricName];
  if (options && options.length === 1) {
    setAggregation(options[0]);
  } else {
    setAggregation(''); // reset if multiple or none
  }
}, [metricName]);

  // Determina se precisa mostrar campo de agregação
  const shouldShowAggregation =
    metricType === 'singular' &&
    metricName !== 'ticketMedio' &&
    metricName !== 'faturamento' &&
    metricName !== 'tempoDeEntrega' &&
    availableAggregations.length > 0;

  // Determina se precisa mostrar campo de período
  //const shouldShowPeriod = metricType === 'graph';
  const shouldShowPeriod = true;

  function confirmButtonCallback() {
    if (!metricName) {
      alert('Selecione uma métrica válida!');
      return;
    }

    const metricConfig = {
      type: metricType,
      metric: metricName,
      aggregateFunction:
        metricName === 'ticketMedio' ? 'sum' : aggregation || 'sum',
      period: shouldShowPeriod ? period : 'month',
      count: periodCount,
      title: optionMetricMap[metricName]
    };

    onConfirm(metricConfig);
    handleClose();
  }

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Nova Métrica
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            Tipo de Métrica
          </Typography>
          <BasicSelect
            options={[
              { key: 'Métrica Unitária', value: 'singular' },
              { key: 'Gráfico', value: 'graph' },
            ]}
            selectedValue={metricType}
            updateValue={setMetricType}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Métrica
          </Typography>
          <BasicSelect
            options={metricOptions}
            selectedValue={metricName}
            updateValue={setMetricName}
          />

          {shouldShowAggregation && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Operação
              </Typography>
              <BasicSelect
                options={availableAggregations.map((a) => ({
                  key: a.toUpperCase(),
                  value: a,
                }))}
                selectedValue={aggregation}
                updateValue={setAggregation}
              />
            </>
          )}

          {shouldShowPeriod && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Período
              </Typography>
              <BasicSelect
                options={periodOptions}
                selectedValue={period}
                updateValue={setPeriod}
              />
            </>
          )}
            <>
                <Typography variant="h6" sx={{ mt: 2 }}>
                Intervalo
                </Typography>


                <input
                type="number"
                min="1"
                value={periodCount}
                onChange={(e) => {setPeriodCount(e.target.value);}}
                style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '14px'
                }}
                />
            </>

          <Box sx={{ mt: 3 }}>
            <BasicButton callback={confirmButtonCallback} />
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
