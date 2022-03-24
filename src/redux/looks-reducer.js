import { feedAPI } from "../api/api"

const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const SET_LOOKS = 'SET_LOOKS'
const SET_TOPICS = 'SET_TOPICS'
const SET_LOOK = 'SET_LOOK'
const SET_TOPIC = 'SET_TOPIC'

let initialState = {
    looks: [],
    isFetching: false,
    currentPage: 0,
    currentLook: {},
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
        default: 
            return state
    }
}

export const setLooks = (looks) => ({ type: SET_LOOKS, looks })
export const setTopics = (topics) => ({ type: SET_TOPICS, topics })
export const setLook = (currentLook) => ({ type: SET_LOOK, currentLook })
export const setTopic = (currentTopic) => ({ type: SET_TOPIC, currentTopic })
export const setCurrentPage = (currentPage) => ({ type: SET_CURRENT_PAGE, currentPage })
export const toggleIsFetching = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching })

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
        dispatch(setLook(response.data))
        dispatch(toggleIsFetching(false))
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}

export const requestTopics = () => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getAllTopics()
    if(response.status == 200){
        dispatch(setTopics(response.data.map(topic => ({name: topic.name, slug: topic.slug}))))
        dispatch(toggleIsFetching(false))
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}

export const getCurrentTopic = (slug) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getTopic(slug)
    if(response.status == 200){
        dispatch(setTopic(response.data))
        dispatch(toggleIsFetching(false))
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}

