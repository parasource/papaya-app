import {
    authAPI
} from "../api/api"
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SET_USER_DATA = 'SET_USER_DATA'
const SET_TOKEN = 'SET_TOKEN'
const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR'
const TOGGLE_NOTIFICATION = 'TOGGLE_NOTIFICATION'

let initialState = {
    id: null,
    email: null,
    name: null,
    sex: null,
    accessToken: null,
    refreshToken: null,
    isAuth: false,
    isFirstTime: true,
    loginError: '', 
    registerError: '',
    toggleNotification: true
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
        case TOGGLE_NOTIFICATION: 
            return {
                ...state,
                toggleNotification: action.toggleNotification
            }
        default:
            return state;
    }
}


export const setAuthUserData = (id, email, name, sex) =>
    ({
        type: SET_USER_DATA,
        payload: {
            id,
            email,
            name, 
            sex,
        }
    })
    
export const toggleNotification = (toggleNotification) =>
    ({
        type: TOGGLE_NOTIFICATION,
        toggleNotification
    })

export const setAuthUserToken = (accessToken, refreshToken, isAuth, isFirstTime) =>
    ({
        type: SET_TOKEN,
        payload: {
            refreshToken,
            accessToken,
            isAuth,
            isFirstTime
        }
    })
export const setLoginError = (loginError) =>
    ({
        type: SET_TOKEN,
        payload: {
            loginError
        }
    })

export const requestUser = () => async (dispatch) => {
    let response = await authAPI.me()
    if(response.status == 200){
        let {
            ID,
            email,
            name,
            sex
        } = response.data
        dispatch(setAuthUserData(ID, email, name, sex))
        dispatch(setLoginError(''))
    }else{
        dispatch(setLoginError(response))
    }
}

export const logout = () => async (dispatch) => {
    dispatch(setAuthUserData(null, null, null, null))
    dispatch(setAuthUserToken(null, null, false))
    await SecureStore.deleteItemAsync('token', null)
    await SecureStore.deleteItemAsync('refresh_token', null)
}

export const checkToken = () => async (dispatch) => {
    const token = await SecureStore.getItemAsync('token')
    const refreshToken = await SecureStore.getItemAsync('refresh_token')
    if(!initialState.accessToken && token){
        dispatch(setAuthUserToken(token, refreshToken, true))
        let userResponse = await authAPI.me()
        if(userResponse.status == 200){
            let {
                ID,
                email,
                name,
                sex
            } = userResponse.data
            dispatch(setAuthUserData(ID, email, name, sex))
        }
    }
}

export const updateUser = (data) => async (dispatch) => {
    let response = await authAPI.updateSettings(data)
    if(response.status == 200){
        let userResponse = await authAPI.me()
        let {
            ID,
            email,
            name,
            sex
        } = userResponse.data
        dispatch(setAuthUserData(ID, email, name, sex))
        dispatch(setLoginError(''))
    }else{
        dispatch(setLoginError(response))
    }
}


export const googleLogin = (token) => async (dispatch) => {
    let response = await authAPI.googleLogin(token)
    if(response.status == 200){
        const accessToken = response.data.token;
        const refreshToken = response.data.refresh_token;
        await SecureStore.setItemAsync('token', accessToken)
        await SecureStore.setItemAsync('refresh_token', refreshToken)
        dispatch(setAuthUserToken(accessToken, refreshToken, true, response.data.first_time))
        let userResponse = await authAPI.me()
        let {
            ID,
            email,
            name,
            sex
        } = userResponse.data
        dispatch(setAuthUserData(ID, email, name, sex))
        dispatch(setLoginError(''))
        await AsyncStorage.setItem('notification', 'on')
    }else{
        console.log(response);
        dispatch(setLoginError(response))
    }
}

export const appleLogin = (token) => async (dispatch) => {
    let response = await authAPI.appleLogin(token)
    if(response.status == 200){
        const accessToken = response.data.token;
        const refreshToken = response.data.refresh_token;
        await SecureStore.setItemAsync('token', accessToken)
        await SecureStore.setItemAsync('refresh_token', refreshToken)
        dispatch(setAuthUserToken(accessToken, refreshToken, true, response.data.first_time))
        let userResponse = await authAPI.me()
        let {
            ID,
            email,
            name,
            sex
        } = userResponse.data
        dispatch(setAuthUserData(ID, email, name, sex))
        dispatch(setLoginError(''))
        await AsyncStorage.setItem('notification', 'on')
    }else{
        console.log(response);
        dispatch(setLoginError(response))
    }
}