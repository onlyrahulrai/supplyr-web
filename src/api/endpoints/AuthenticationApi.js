import apiClient from 'api/base'

// const base_api_url = '/'
const AuthenticationApi = {
    requestPasswordReset: (data) =>
        apiClient.post('auth/password/reset/', data),
    resetPassword: (data) =>
        apiClient.post('auth/password/reset/confirm/', data),
}


export default AuthenticationApi