export const formatMetricValue = (metricName, value) => {
  if (value == null) return 'N/A';

  switch (metricName) {
    case 'faturamento':
    case 'ticketMedio':
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);

    case 'quantidadePedidos':
    case 'itensVendidos':
      return new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 0,
      }).format(value);

    case 'tempoDeEntrega':
      const df = new Intl.DurationFormat('en-US', {
        style: 'long', // or 'short', 'narrow'
        hours: 'numeric',
        minutes: 'numeric',
        seconds: 'numeric',
      });

      
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const seconds = Math.floor(value % 60);

      return df.format({ hours, minutes, seconds });
          default:
      return value.toFixed ? value.toFixed(1) : value;
  }
}