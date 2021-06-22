import { Suspense, lazy } from "react";
import * as React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom"
import { history } from "./history"
import { connect } from "react-redux"
import Spinner from "./components/@vuexy/spinner/Loading-spinner"
import { ContextLayout } from "./utility/context/Layout"


// Route-based code splitting
const Home = lazy(() =>
    import("./views/pages/Home")
)

const Products = lazy(() =>
    import("./views/inventory/Products")
)
const ProductsList = lazy(() =>
    import("./views/inventory/ProductsList")
)
const AddProduct = lazy(() =>
    import("./views/inventory/AddProduct")
)
const ImportProduct = lazy(() =>
    import("./views/import-export/ImportProduct")
)
const ExportProduct = lazy(() =>
    import("./views/import-export/ExportProduct")
)
const ProductDetails = lazy(() =>
    import("./views/listing/ProductDetails")
)

const CategoryList = lazy(() =>
    import("./views/inventory/CategoryList")
)

const CategoryAdd = lazy(() =>
    import("./views/inventory/CategoryAdd")
)

const login = lazy(() =>
    import("./views/pages/authentication/Login")
)

const register = lazy(() =>
    import("views/pages/authentication/Register")
)

const ProfilingWizard = lazy(() =>
    import("views/pages/ProfilingWizard")
)

const OrdersList = lazy(() =>
    import("views/orders/OrdersList")
)

const OrderDetails = lazy(() =>
    import("views/orders/OrderDetails")
)

const Logout = lazy(() =>
    import("./views/pages/authentication/Logout")
)

const Salespersons = lazy(() =>
    import("./views/management/Salespersons")
)

const AccountSettings = lazy(() =>
  import("./views/pages/account-settings/AccountSettings")
)

const Landing = lazy(() => import("./views/pages/Landing"))

const error404 = lazy(() => import("./views/pages/404"))

const ConfirmEmail = lazy(() => import("./views/pages/authentication/ConfirmEmail"))
const PasswordReset = lazy(() => import("./views/pages/authentication/PasswordReset"))
const PasswordResetRequest = lazy(() => import("./views/pages/authentication/PasswordResetRequest"))

// Set Layout and Component Using App Route
const RouteConfig = ({
    component: Component,
    fullLayout,
    noLayout,
    permission,
    user,
    authenticated,
    publicUrl = false,
    publicOnlyUrl = false,
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
                    }} />
                )

                let authenticatedUserRedirect = (
                    <Redirect to={{
                        pathname: '/dashboard',
                        state: { from: props.location }
                    }} />
                )

                let redirectToProfiling = (<Redirect to={{
                        pathname: '/profiling',
                        state: { from: props.location }
                    }} />)

                if (publicOnlyUrl) {
                    return authenticated
                        ? authenticatedUserRedirect
                        : actualContent
                }


                if (publicUrl) {
                    return actualContent
                }

                //Since user disn't pass the conditions above, this means the URL is pointing to private content
                if (authenticated) {
                    if (user.user_status === 'approved') {

                        if (props.location.pathname === '/profiling') {
                            return authenticatedUserRedirect
                        }
                        return actualContent;
                    }
                    else if (props.location.pathname === '/profiling' || props.location.pathname === '/logout') {
                        return actualContent;
                    }

                    return redirectToProfiling;
                }

                else {
                    return guestUserRedirect
                }
            }}
        />
    )

const PublicRouteConfig = ({ ...rest }) => (
    <RouteConfig
        {...rest}
        publicUrl={true}
    />
);

const PublicOnlyRouteConfig = ({ ...rest }) => (
    <RouteConfig
        {...rest}
        publicOnlyUrl={true}
    />
);



const mapStateToProps = state => {
    return {
        // user: state.auth.userRole
        user: state.auth.userInfo,
        authenticated: state.auth.authenticated
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
                    <PublicAppRoute
                        exact
                        path="/confirm-email/:key/"
                        component={ConfirmEmail}
                        noLayout
                    />
                    <PublicOnlyAppRoute
                        exact
                        path="/forgot-password/"
                        component={PasswordResetRequest}
                        fullLayout
                    />
                    <PublicOnlyAppRoute
                        exact
                        path="/password-reset/:uid/:token/"
                        component={PasswordReset}
                        fullLayout
                    />
                    <PublicOnlyAppRoute
                        exact
                        path="/"
                        component={Landing}
                        fullLayout
                    />
                    <AppRoute
                        path="/account-settings"
                        component={AccountSettings}
                    />
                    <AppRoute
                        exact
                        path="/profiling"
                        component={ProfilingWizard}
                    />
                    <AppRoute
                        exact
                        path="/dashboard"
                        component={Home}
                    />
                    <AppRoute
                        exact
                        path="/inventory"
                        component={Products}
                    />
                    <AppRoute
                        exact
                        path="/products/"
                        component={ProductsList}
                    />
                    <AppRoute
                        exact
                        path="/product/:slug/"
                        component={ProductDetails}
                    />
                    <AppRoute
                        path="/products/add/"
                        component={AddProduct}
                    />
                    <AppRoute
                        path="/products/import/"
                        component={ImportProduct}
                    />
                    <AppRoute
                        path="/products/export/"
                        component={ExportProduct}
                    />
                    <AppRoute
                        path="/product/:slug/edit/"
                        component={AddProduct}
                    />
                    <AppRoute
                        path="/inventory/categories/list"
                        component={CategoryList}
                    />
                    <AppRoute
                        path="/inventory/categories/add"
                        component={CategoryAdd}
                    />
                    <AppRoute
                        path="/inventory/categories/edit/:categoryId"
                        component={CategoryAdd}
                    />
                    
                    <AppRoute
                        path="/orders/:orderId"
                        component={OrderDetails}
                    />                    
                    <AppRoute
                        path="/orders"
                        component={OrdersList}
                    />
                    <AppRoute
                        path="/management/salespersons"
                        component={Salespersons}
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

                    <AppRoute component={error404} fullLayout />
                </Switch>
            </Router>
        )
    }
}

export default AppRouter
