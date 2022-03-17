import {
    authAPI
} from "../api/api"
import * as SecureStore from 'expo-secure-store';

const SET_USER_DATA = 'SET_USER_DATA'
const SET_TOKEN = 'SET_TOKEN'
const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR'

let initialState = {
    id: null,
    email: null,
    login: null,
    accessToken: null,
    isAuth: false,
    loginError: '', 
    registerError: ''
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state,
                ...action.payload
            }
        case SET_TOKEN:
            return {
                ...state,
                ...action.payload
            }
        case SET_LOGIN_ERROR: 
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}


export const setAuthUserData = (id, email, login, accessToken, isAuth) =>
    ({
        type: SET_USER_DATA,
        payload: {
            id,
            email,
            login,
            accessToken,
            isAuth
        }
    })

export const setAuthUserToken = (accessToken, isAuth) =>
    ({
        type: SET_TOKEN,
        payload: {
            accessToken,
            isAuth
        }
    })
export const setLoginError = (loginError) =>
    ({
        type: SET_TOKEN,
        payload: {
            loginError
        }
    })

export const login = (data) => async (dispatch) => {
    let response = await authAPI.login(data)
    if(response.status == 200){
        const accessToken = response.data.token;
        await SecureStore.setItemAsync('token', accessToken)
        let userResponse = await authAPI.me()
        let {
            ID,
            email,
            name
        } = userResponse.data
        dispatch(setAuthUserData(ID, email, name, accessToken, true))
        dispatch(setLoginError(''))
    }else{
        dispatch(setLoginError(response))
    }
}
export const register = (data) => async (dispatch) => {
    let response = await authAPI.register(data)
    if(response.status == 200){
        const accessToken = response.data.token;
        await SecureStore.setItemAsync('token', accessToken)
        let userResponse = await authAPI.me()
        let {
            ID,
            email,
            name
        } = userResponse.data
        dispatch(setAuthUserData(ID, email, name, accessToken, true))
        dispatch(setLoginError(''))
    }else{
        dispatch(setLoginError(response))
    }
}

export const logout = () => async (dispatch) => {
    dispatch(setAuthUserData(null, null, null, null, false))
    await SecureStore.deleteItemAsync('token', null)
}

export const checkToken = () => async (dispatch) => {
    const token = await SecureStore.getItemAsync('token')
    if(!initialState.accessToken && token){
        dispatch(setAuthUserToken(token, true))
    }
}
