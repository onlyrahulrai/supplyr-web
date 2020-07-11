import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Layout } from "./utility/context/Layout"
import * as serviceWorker from "./serviceWorker"
import { store } from "./redux/storeConfig/store"
import Spinner from "./components/@vuexy/spinner/Fallback-spinner"
import "./index.scss"
import "./@fake-db"

import axios from "axios"

const LazyApp = lazy(() => import("./App"))


const token = localStorage.getItem('token');
if (token) {

  axios.get('http://127.0.0.1:8000/user-details/', {
    headers: {
      Authorization: "Bearer " + token
    }
  }).then(response => {
    store.dispatch({ type: 'LOGIN', user: response.data });
  })
  .catch(error => {
    store.dispatch({ type: 'LOGOUT' });
  })
    // store.dispatch({ type: 'FETCH_USER_DATA', token: token });
}


// configureDatabase()
ReactDOM.render(
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <Layout>
            <LazyApp />
        </Layout>
      </Suspense>
    </Provider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
