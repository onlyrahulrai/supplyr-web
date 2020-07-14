import axios from "axios"
import { history } from "../../../history"    
import apiClient from "api/base"

// export const changeRole = role => {
//   return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
// }

export const loginWithJWT = (user, onError) => {
  return dispatch => {
      apiClient.post("login/", {
        email: user.email,
        password: user.password,
      })
      .then(response => {
        var loggedInUser
        if (response.data) {
          loggedInUser = response.data.user
          dispatch({
            type: "LOGIN",
            user: loggedInUser
          })

          localStorage.setItem('token', response.data.access_token)
          history.push("/")
        }
      })
      .catch(err => {
        onError(err)
      })
  }
}      