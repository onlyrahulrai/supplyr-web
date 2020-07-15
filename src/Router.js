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
  import("./views/pages/authentication/Login")
)

const register = lazy(() =>
  import("views/pages/authentication/Register")
)

const Logout = lazy(() =>
  import("./views/pages/authentication/Logout")
)

const Landing = lazy(() => import("./views/pages/Landing"))

// Set Layout and Component Using App Route
const RouteConfig = ({
  component: Component,
  fullLayout,
  noLayout,
  permission,
  user,
  authenticated,
  publicUrl=false,
  publicOnlyUrl=false,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      let actualContent = (
          <ContextLayout.Consumer>
            {context => {
              let LayoutTag = fullLayout
              ? context.fullLayout
              : noLayout
              ? context.noLayout
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

      let guestUserRedirect = (
          <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }}/>
        )

      let authenticatedUserRedirect = (
        <Redirect to={{
            pathname: '/dashboard',
            state: { from: props.location }
          }}/>
      )

      if (publicOnlyUrl) {
        return authenticated
        ? authenticatedUserRedirect
        : actualContent
      }

      let accessAllowed = publicUrl || authenticated

      return accessAllowed
        ? actualContent
        : guestUserRedirect
    }}
  />
)

const PublicRouteConfig = ({ ...rest}) => (
  <RouteConfig
    {...rest}
    publicUrl = {true}
  />
);

const PublicOnlyRouteConfig = ({ ...rest}) => (
  <RouteConfig
    {...rest}
    publicOnlyUrl = {true}
  />
);



const mapStateToProps = state => {
  return {
    // user: state.auth.userRole
    user: state.auth.user,
    authenticated: state.auth.authenticated,
  }
}

const AppRoute = connect(mapStateToProps)(RouteConfig)
const PublicAppRoute = connect(mapStateToProps)(PublicRouteConfig)
const PublicOnlyAppRoute = connect(mapStateToProps)(PublicOnlyRouteConfig)

class AppRouter extends React.Component {
  render() {
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>
        <Switch>
          <PublicOnlyAppRoute
            exact
            path="/"
            component={Landing}
            noLayout
          />
          <AppRoute
            exact
            path="/dashboard"
            component={Home}
          />
          <AppRoute
            path="/page2"
            component={Page2}
            authenticated={true}
          />
          <PublicOnlyAppRoute
            path="/login"
            component={login}
            fullLayout
          />

          <PublicOnlyAppRoute
            path="/register"
            component={register}
            fullLayout
          />

          <AppRoute
            path="/logout"
            component={Logout}
            fullLayout
          />
        </Switch>
      </Router>
    )
  }
}

export default AppRouter
