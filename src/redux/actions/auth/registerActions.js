import { history } from "../../../history"
import axios from "axios"
import apiClient from "api/base"

export const signupWithJWT = (form_data, onError) => {
  return dispatch => {
    apiClient
      .post("register/", {
        email: form_data.email,
        password1: form_data.password1,
        password2: form_data.password2,
        name: form_data.name
      })
      .then(response => {
        var loggedInUser, token

        if(response.data){

          loggedInUser = response.data.user
          token = response.data.access_token

          dispatch({
            type: "LOGIN",
            user: loggedInUser,
            token: token,
          })

          history.push("/")
        }

      })
      .catch(err => {
        onError(err)
      })

  }
}
