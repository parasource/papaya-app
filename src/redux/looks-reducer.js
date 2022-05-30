import { feedAPI } from "../api/api"

const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const SET_LOOKS = 'SET_LOOKS'
const SET_CATEGORIES = 'SET_CATEGORIES'
const SET_ITEM = 'SET_ITEM'
const SET_LOOK = 'SET_LOOK'
const SET_TODAY_LOOK = 'SET_TODAY_LOOK'
const TOGGLE_LIKED = 'TOGGLE_LIKED'
const TOGGLE_DISLIKED = 'TOGGLE_DISLIKED'
const TOGGLE_IS_LIST_END = 'TOGGLE_IS_LIST_END'

let initialState = {
    looks: [],
    categories: [],
    isFetching: false,
    currentLook: {},
    isLiked: false,
    isDisliked: false,
    todayLook: {},
    currentItem: {},
    isListEnd: false
}

export const looksReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOOKS: 
            return {...state, looks: [...state.looks, ...action.looks]}
        case SET_CATEGORIES: 
            return {...state, categories: action.categories}
        case SET_ITEM: 
            return {...state, currentItem: action.currentItem}
        case TOGGLE_IS_FETCHING: 
            return {...state, isFetching: action.isFetching}
        case SET_LOOK: 
            return {...state, currentLook: action.currentLook}
        case SET_TODAY_LOOK: 
            return {...state, todayLook: action.todayLook}
        case TOGGLE_LIKED: 
            return {...state, isLiked: action.isLiked}
        case TOGGLE_DISLIKED: 
            return {...state, isDisliked: action.isDisliked}
        case TOGGLE_IS_LIST_END: 
            return {...state, isListEnd: action.isListEnd}
        default: 
            return state
    }
}

const setLooks = (looks) => ({ type: SET_LOOKS, looks })
const setCategories = (categories) => ({ type: SET_CATEGORIES, categories })
const setCurrentItem = (currentItem) => ({ type: SET_ITEM, currentItem })
const setLook = (currentLook) => ({ type: SET_LOOK, currentLook })
const setTodayLook = (todayLook) => ({ type: SET_TODAY_LOOK, todayLook })
const toggleIsFetching = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching })
const toggleLiked = (isLiked) => ({ type: TOGGLE_LIKED, isLiked })
const toggleDisliked = (isDisliked) => ({ type: TOGGLE_DISLIKED, isDisliked })
const toggleIsListEnd = (isListEnd) => ({ type: TOGGLE_IS_LIST_END, isListEnd })


export const requestLooks = (page) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getLooks(page)
    if(response.status == 200){
        dispatch(setLooks(response.data.looks))
        if(!response.data.looks.length){
            dispatch(toggleIsListEnd(true))
        }else{
            dispatch(setCategories(response.data.categories))
            dispatch(setTodayLook(response.data.todayLook))
        }
        dispatch(toggleIsFetching(false))
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}

export const requestItem = (slug, id) => async (dispatch) => {
    const response = await feedAPI.getItem(slug, id)
    if(response.status == 200){
        dispatch(setCurrentItem(response.data))
    }else{
        console.log(response);
    }
}

export const getCurrentLook = (slug) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getLook(slug)
    if(response.status == 200){
        dispatch(setLook(response.data.look))
        dispatch(toggleLiked(response.data.isLiked))
        dispatch(toggleDisliked(response.data.isDisliked))
        dispatch(toggleIsFetching(false))
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}

export const likeLook = (slug) => async (dispatch) => {
    await feedAPI.likeLook(slug).then(res => {
        dispatch(toggleLiked(true))
    })
}

export const dislikeLook = (slug) => async (dispatch) => {
    await feedAPI.dislikeLook(slug).then(res => {
        dispatch(toggleDisliked(true))
    })
}

export const unlikeLook = (slug) => async (dispatch) => {
    await feedAPI.unlikeLook(slug).then(res => {
        dispatch(toggleLiked(false))
    })
}

export const undislikeLook = (slug) => async (dispatch) => {
    await feedAPI.undislikeLook(slug).then(res => {
        dispatch(toggleDisliked(false))
    })
}