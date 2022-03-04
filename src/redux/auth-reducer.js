import {
    authAPI
} from "../api/api"
import * as SecureStore from 'expo-secure-store';

const SET_USER_DATA = 'SET_USER_DATA'
const SET_TOKEN = 'SET_TOKEN'

let initialState = {
    usersId: null,
    email: null,
    login: null,
    accessToken: null,
    isAuth: false,
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

export const login = (email, password) => async (dispatch) => {
        let response = await authAPI.login(email, password)
        if(response.data.success){
            const accessToken = response.data.token;
            await SecureStore.setItemAsync('token', accessToken)
            let userResponse = await authAPI.me()
            let {
                id,
                email,
                name
            } = userResponse.data
            dispatch(setAuthUserData(id, email, name, accessToken, true))
        }else{
            console.log("Login error: ", response.data.message);
        }
}

export const register = (name, email, password) => async (dispatch) => {
    try{   
        let response = await authAPI.register(name, email, password)
        const accessToken = response.data.token;
        await SecureStore.setItemAsync('token', accessToken)

        let userResponse = await authAPI.me()
        const {
            userId,
            userEmail,
            userName
        } = userResponse.data
        
        dispatch(setAuthUserData(userId, userEmail, userName, accessToken, true))
    }catch (error) {
        console.log("Register error: ", response.data.message);
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
