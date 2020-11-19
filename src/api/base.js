import axios from "axios"
import { store } from "redux/storeConfig/store"

const baseURL = process.env.REACT_APP_API_URL + "/seller"

const apiClient = axios.create({
    baseURL: baseURL,
    // headers: {'X-Custom-Header-ATD': 'foobar'}
})


apiClient.interceptors.response.use(
    response => {
    if (response.data?.user_info) {
        const userInfo = response.data.user_info
        store.dispatch({ type: 'SET_USER_INFO', userInfo})
        
        let userRole = null;
        if (['admin', 'staff'].includes(userInfo.user_role)) {
            userRole = userInfo.user_role
        }
        
        userRole && store.dispatch({ type: "CHANGE_ROLE", userRole })
    }
    return response
    },
    error => {
        // if(error.response?.status === 401){
        //     store.dispatch({ type: 'LOGOUT' });
        // }
        return Promise.reject(error);
    })

apiClient.authorize = token => {
    token = token || localStorage.getItem('token')
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = "Bearer " + token
    }
}

apiClient.deauthorize = () => {
    delete apiClient.defaults.headers.common['Authorization'];
}

apiClient.authorize()
export default apiClient