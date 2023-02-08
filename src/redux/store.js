import thunkMiddlewere from "redux-thunk"
import {
    applyMiddleware,
    combineReducers,
    compose,
    createStore } from "redux";
import {authReducer} from "./auth-reducer";
import { looksReducer } from "./looks-reducer";
import { wardrobeReducer } from "./wardrobe-reducer";
import { searchReducer } from "./search-reducer";

const reducers = combineReducers({
    auth: authReducer,
    wardrobe: wardrobeReducer,
    feed: looksReducer,
    search: searchReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(reducers, composeEnhancers(
    applyMiddleware(thunkMiddlewere)
))

window.store = store