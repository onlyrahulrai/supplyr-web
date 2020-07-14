import axios from "axios"
import { history } from "../../../history"      

// export const changeRole = role => {
//   return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
// }

export const loginWithJWT = user => {
  return dispatch => {
    axios
      .post("http://127.0.0.1:8000/login/", {
        email: user.email,
        password: user.password,
      }, {
        // withCredentials: true
        // set withCredentials to allow cookies
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
      .catch(err => console.log(err))
  }
}      