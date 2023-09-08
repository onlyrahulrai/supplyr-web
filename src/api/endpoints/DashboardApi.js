import apiClient from 'api/base'

const base_api_url = '/'
const DashboardApi = {
    stats: () =>
        apiClient.get(base_api_url + 'seller-dashboard-stats/'),
}


export default DashboardApi