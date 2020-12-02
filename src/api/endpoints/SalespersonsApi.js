import apiClient from 'api/base'

const base_api_url = '/profile/salespersons/'
const SalespersonsApi = {
    index: () =>
        apiClient.get(base_api_url),
    add: email => apiClient.post(base_api_url, {email}),
    delete: (salespersonId) => 
        apiClient.delete(base_api_url + salespersonId),
}


export default SalespersonsApi