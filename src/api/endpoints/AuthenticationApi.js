import apiClient from 'api/base'

// const base_api_url = '/'
const AuthenticationApi = {
    requestPasswordReset: (data) =>
        apiClient.post('request-forget-password/', data),
    resetEmailPassword: (data) =>
        apiClient.post('password-reset-email-confirm/', data),
    resetMobilePassword: (data) =>
        apiClient.post('password-reset-mobile-confirm/', data),
    passwordChange: (data) =>
        apiClient.post('auth/password/change/', data),
    
}


export default AuthenticationApi