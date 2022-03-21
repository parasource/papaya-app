import thunkMiddlewere from "redux-thunk"
import {
    applyMiddleware,
    combineReducers,
    compose,
    createStore } from "redux";
import {authReducer} from "./auth-reducer";
import {interestsReducer} from "./interests-reducer";
import { looksReducer } from "./looks-reducer";

const reducers = combineReducers({
    auth: authReducer,
    interests: interestsReducer,
    feed: looksReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(reducers, composeEnhancers(
    applyMiddleware(thunkMiddlewere)
))

window.store = store