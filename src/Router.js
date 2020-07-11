import React, { Suspense, lazy } from "react"
import { Router, Switch, Route, Redirect } from "react-router-dom"
import { history } from "./history"
import { connect } from "react-redux"
import Spinner from "./components/@vuexy/spinner/Loading-spinner"
import { ContextLayout } from "./utility/context/Layout"

// Route-based code splitting
const Home = lazy(() =>
  import("./views/pages/Home")
)

const Page2 = lazy(() =>
  import("./views/pages/Page2")
)

const login = lazy(() =>
  import("./views/pages/authentication/login/Login")
)

// Set Layout and Component Using App Route
const RouteConfig = ({
  component: Component,
  fullLayout,
  permission,
  user,
  authenticated=true,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      return authenticated
        ? (
          <ContextLayout.Consumer>
            {context => {
              let LayoutTag = fullLayout
              ? context.fullLayout
              : context.VerticalLayout
                return (
                  <LayoutTag {...props} permission={props.user}>
                    <Suspense fallback={<Spinner />}>
                      <Component {...props} />
                    </Suspense>
                  </LayoutTag>
                )
            }}
          </ContextLayout.Consumer>
        )
        : (
          <Redirect to={{
            pathname: '/pages/login',
            state: { from: props.location }
          }}/>
        )
    }}
  />
)

const PrivateRouteConfig = ({ authenticated = true, ...rest}) => (
  <RouteConfig
    {...rest}
    authenticated={authenticated}
  />
);


const mapStateToProps = state => {
  return {
    user: state.auth.login.userRole
  }
}

const AppRoute = connect(mapStateToProps)(RouteConfig)
const PrivateAppRoute = connect(mapStateToProps)(PrivateRouteConfig)

class AppRouter extends React.Component {
  render() {
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>
        <Switch>
          <AppRoute
            exact
            path="/"
            component={Home}
          />
          <PrivateAppRoute
            path="/page2"
            component={Page2}
            authenticated={false}
          />
          <AppRoute
            path="/pages/login"
            component={login}
            fullLayout
          />
        </Switch>
      </Router>
    )
  }
}

export default AppRouter
