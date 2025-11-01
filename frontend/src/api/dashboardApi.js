import api from './axiosConfig';

// Function to fetch a list of charts/data for the dashboard
export const fetchMetricData = async (params) => {
  const response = await api.get('/sales', { params: params});
  return response.data; // The component only deals with the clean data
};

export const fetchStoreNames = async () => {
  const response = await api.get('/stores');
  return response.data; // The component only deals with the clean data
};

// Function to submit a new chart configuration
export const postNewChartConfig = async (configData) => {
  const response = await api.post('/api/v1/charts/new', configData);
  return response.data;
};