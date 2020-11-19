import apiClient from "api/base"

export const changeRole = role => {
  return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
}

export const loginWithJWT = (user, onError) => {
  return dispatch => {
      apiClient.post("login/", {
        email: user.email,
        password: user.password,
      })
      .then(response => {
        var token
        if (response.data) {
          token = response.data.access_token
          dispatch({
            type: "LOGIN",
            token: token,
          })

          // localStorage.setItem('token', response.data.access_token)
          // history.push("/inventory/list")
        }
      })
      .catch(err => {
        onError(err)
      })
  }
}    

export const refreshLogin = token => {
  // console.log("rreftresh login")
  return dispatch => {
    return apiClient.get('user-details/')
    .then(response => {
        dispatch({ type: 'LOGIN' });
    })
    .catch(error => {
      if(error.response?.status === 401){
        dispatch({ type: 'LOGOUT' });
      }
    })
  }
}