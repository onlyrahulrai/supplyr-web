// export const changeRole = role => {
//   return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
// }

import axios from "axios"
import { history } from "../../../history"      
export const loginWithJWT = user => {
  return dispatch => {
    axios
      .post("http://127.0.0.1:8000/dj-rest-auth/login/", {
        email: user.email,
        password: user.password
      })
      .then(response => {
        var loggedInUser
        if (response.data) {
          loggedInUser = response.data.user
          dispatch({
            type: "LOGIN_WITH_JWT",
            payload: { loggedInUser, loggedInWith: "jwt" }
          })
          history.push("/")
        }
      })
      .catch(err => console.log(err))
  }
}      