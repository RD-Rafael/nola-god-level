import axios from 'axios'
import Qs from 'qs'


const api = axios.create({
    timeout: 1000 * 5,
    baseURL: 'http://localhost:8000',
    headers: {        
        'Accept': '*/*',
        'Content-Type': 'application/json',
    },
    paramsSerializer: params => Qs.stringify(params, {arrayFormat: 'repeat'})
})

export default api
