import axios from "axios"
import { store } from "redux/storeConfig/store"

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    // headers: {'X-Custom-Header-ATD': 'foobar'}
})

const token = localStorage.getItem('token');
if(token) {
    apiClient.defaults.headers.common['Authorization'] = "Bearer " + token
}

apiClient.interceptors.response.use(response => response, error => {
    store.dispatch({ type: 'LOGOUT' });
    return Promise.reject(error);
})

export default apiClient