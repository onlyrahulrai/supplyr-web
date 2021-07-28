import { createStore, applyMiddleware, compose } from "redux"
import createDebounce from "redux-debounced"
import thunk from "redux-thunk"
import rootReducer from "../reducers/rootReducer"
import {createStateSyncMiddleware, initMessageListener} from "redux-state-sync";

const reduxStateSyncConfig = {};

const middlewares = [thunk, createDebounce()]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(...middlewares), applyMiddleware(createStateSyncMiddleware(reduxStateSyncConfig)))
)

initMessageListener(store);

export { store }
