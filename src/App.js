import { useState, useLayoutEffect } from "react";
import Router from "./Router"
import "./components/@vuexy/rippleButton/RippleButton"
import "react-perfect-scrollbar/dist/css/styles.css"
import "prismjs/themes/prism-tomorrow.css"
import { refreshLogin } from "redux/actions/auth/loginActions"
import { connect } from "react-redux"
import Spinner from "./components/@vuexy/spinner/Fallback-spinner"


const App = props => {
  const [ready, setReady] = useState(false)
  useLayoutEffect(() => {
    if (localStorage.getItem('token')) {
      props.refreshLogin()
        .finally(() => {
          setReady(true);
        })
    }
    else setReady(true)
    // eslint-disable-next-line
  }, [])
  return (ready ? <Router /> : <Spinner />)
}

export default connect(null, {refreshLogin})(App)
