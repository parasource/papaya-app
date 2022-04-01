import { feedAPI } from "../api/api"

const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const SET_LOOKS = 'SET_LOOKS'
const SET_TOPICS = 'SET_TOPICS'
const SET_LOOK = 'SET_LOOK'
const SET_TOPIC = 'SET_TOPIC'
const TOGGLE_LIKED = 'TOGGLE_LIKED'

let initialState = {
    looks: [],
    isFetching: false,
    currentPage: 0,
    currentLook: {},
    isLiked: false,
    currentTopic: {},
    topics: []
}

export const looksReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_PAGE: 
            return {...state, currentPage: action.currentPage}
        case SET_LOOKS: 
            return {...state, looks: action.looks}
        case SET_TOPICS: 
            return {...state, topics: action.topics}
        case TOGGLE_IS_FETCHING: 
            return {...state, isFetching: action.isFetching}
        case SET_LOOK: 
            return {...state, currentLook: action.currentLook}
        case SET_TOPIC: 
            return {...state, currentTopic: action.currentTopic}
        case TOGGLE_LIKED: 
            return {...state, isLiked: action.isLiked}
        default: 
            return state
    }
}

const setLooks = (looks) => ({ type: SET_LOOKS, looks })
const setTopics = (topics) => ({ type: SET_TOPICS, topics })
const setLook = (currentLook) => ({ type: SET_LOOK, currentLook })
const setTopic = (currentTopic) => ({ type: SET_TOPIC, currentTopic })
const setCurrentPage = (currentPage) => ({ type: SET_CURRENT_PAGE, currentPage })
const toggleIsFetching = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching })
const toggleLiked = (isLiked) => ({ type: TOGGLE_LIKED, isLiked })


export const requestLooks = (page) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getLooks(page)
    if(response.status == 200){
        dispatch(setLooks(response.data.looks))
        dispatch(toggleIsFetching(false))
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}

export const getCurrentLook = (slug) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getLook(slug)
    if(response.status == 200){
        dispatch(setLook(response.data.look))
        dispatch(toggleLiked(response.data.isLiked))
        dispatch(toggleIsFetching(false))
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}

export const likeLook = (slug) => async (dispatch) => {
    dispatch(toggleLiked(true))
    await feedAPI.likeLook(slug)
}

export const dislikeLook = (slug) => async (dispatch) => {
    dispatch(toggleLiked(false))
    await feedAPI.dislikeLook(slug)
}

export const requestTopics = () => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getAllTopics()
    if(response.status == 200){
        dispatch(setTopics(response.data.map((topic, index) => ({
            name: topic.name,
            slug: topic.slug
        }))))
        dispatch(toggleIsFetching(false))
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}

export const getCurrentTopic = (slug, page) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getTopic(slug, page)
    if(response.status == 200){
        dispatch(setTopic(response.data))
        dispatch(toggleIsFetching(false))
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}

