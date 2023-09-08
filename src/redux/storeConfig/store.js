import { createStore, applyMiddleware, compose } from "redux"
import createDebounce from "redux-debounced"
import thunk from "redux-thunk"
import rootReducer from "../reducers/rootReducer"


import {createStateSyncMiddleware, initMessageListener} from "redux-state-sync";


/* It is used for checking the redux store changes on logged out of a user.and also added this middleware
----- applyMiddleware(createStateSyncMiddleware(reduxStateSyncConfig)) ----- in composeEnhancers */

const reduxStateSyncConfig = {};

const middlewares = [thunk, createDebounce()]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(...middlewares), applyMiddleware(createStateSyncMiddleware(reduxStateSyncConfig)))
)

// It is used for checking the redux store changes on logged out of a user.
initMessageListener(store);

export { store }
