import apiClient from 'api/base'

// const base_api_url = '/'
const AuthenticationApi = {
    // This route is responsible for requesting the password change from the server. 
    requestPasswordReset: (data) =>
        apiClient.post('request-forget-password/', data),
    
    // This route is responsible for verifying email after getting the password reset link on their email for a password reset.
    resetEmailPassword: (data) =>
        apiClient.post('password-reset-email-confirm/', data),

    // This route is responsible for verifying mobile number after getting the mobile number verification OTP on their registered mobile number for a password reset.
    resetMobilePassword: (data) =>
        apiClient.post('password-reset-mobile-confirm/', data),

    // This route is responsible for changing the password of an authenticated user by typing their previous password and a new password.
    passwordChange: (data) =>
        apiClient.post('auth/password/change/', data),

    // This route is responsible for requesting a change in the mobile number of an authenticated user.
    ChangeMobile: (data) =>
        apiClient.post('update-mobile/', data),

    // This route is responsible for verifying mobile number after getting the mobile number verification OTP on their registered mobile number for mobile number change.
    VerifyOtp: (data) =>
        apiClient.post('confirm-update-mobile/', data),
}


export default AuthenticationApi