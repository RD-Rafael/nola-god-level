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
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const atomic_metrics = [
    "faturamento",
    "quantidadePedidos",
    "ticketMedio",
    "tempoDeEntrega",
    "itensVendidos"
]




function getAgregationFromMetric(metric){
    switch(metric){
        case "faturamento":
            return ["avg", "sum"];
        case "quantidadePedidos":
            return ["avg", "sum"];
        case "ticketMedio":
            return ["avg"];
        case "tempoDeEntrega":
            return ["avg"];
        case "itensVendidos":
            return ["avg", "sum"];
        default:
            return ["Invalid metric"];        
    }

}

export default function BasicModal() {
    const [open, setOpen] = React.useState(false);
    const [newMetricData, setNewMetricData] = React.useState(0);
    const [newMetricType, setNewMetricType] = React.useState(0);
    const [newAggregation, setNewAggregation] = React.useState(0);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    var aggregationOptionsNames = getAgregationFromMetric(newMetricData);

    var aggregationOptions = []
    for(let i = 0; i < aggregationOptionsNames.length; i++){
        aggregationOptions.push({key: aggregationOptionsNames[i], value: aggregationOptionsNames[i]});
    }
    
    var metricDataOptions = []
    for(let i = 0; i < atomic_metrics.length; i++){
        metricDataOptions.push({key: atomic_metrics[i], value: atomic_metrics[i]});
    }

    function confirmButtonCallback(){
        console.log(newMetricData, newMetricType, newAggregation)
        handleClose();
    }

    return (
    <div>
        <Button onClick={handleOpen}>Nova Métrica</Button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Qual métrica?
            </Typography>
            <BasicSelect
                options = {metricDataOptions}
                selectedValue = {newMetricData}
                updateValue={setNewMetricData}
            />
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Que tipo de informação?
            </Typography>
            <BasicSelect
                options = {[{key:"Métrica Unitária", value:0}, {key:"Gráfico", value:1}]}
                selectedValue = {newMetricType}
                updateValue={setNewMetricType}
            />
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Qual operação?
            </Typography>
            <BasicSelect
                options = {aggregationOptions}
                selectedValue = {newAggregation}
                updateValue={setNewAggregation}
            />
            <BasicButton
                callback={confirmButtonCallback}
            />
        </Box>
        </Modal>
    </div>
    );
}