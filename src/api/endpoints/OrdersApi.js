import apiClient from 'api/base'

const base_api_url = '/orders/'
const OrdersApi = {
    index: (queryParams) =>
        apiClient.get(base_api_url+'list/'+queryParams),
    bulkUpdate: (data) =>
        apiClient.post(base_api_url + 'bulk-update/' , data),
    retrieve: (orderId) => 
        apiClient.get(base_api_url + orderId),
    // updatePartial: (addressId, data) => 
    //     apiClient.patch(base_api_url + addressId, data),
    // delete: (addressId) => 
    //     apiClient.delete(base_api_url + addressId),
}


export default OrdersApi