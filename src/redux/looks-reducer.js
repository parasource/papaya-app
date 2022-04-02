import { feedAPI } from "../api/api"

const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const SET_LOOKS = 'SET_LOOKS'
const SET_TOPICS = 'SET_TOPICS'
const SET_WATCHED_TOPICS = 'SET_WATCHED_TOPICS'
const SET_LOOK = 'SET_LOOK'
const SET_TOPIC = 'SET_TOPIC'
const TOGGLE_LIKED = 'TOGGLE_LIKED'
const TOGGLE_DISLIKED = 'TOGGLE_DISLIKED'
const TOGGLE_WATCHED = 'TOGGLE_WATCHED'

let initialState = {
    looks: [],
    isFetching: false,
    currentLook: {},
    isLiked: false,
    isDisliked: false,
    currentTopic: {},
    topics: [],
    isWatched: false,
    watchedTopics: []
}

export const looksReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOOKS: 
            return {...state, looks: action.looks}
        case SET_TOPICS: 
            return {...state, topics: action.topics}
        case SET_WATCHED_TOPICS: 
            return {...state, watchedTopics: action.watchedTopics}
        case TOGGLE_IS_FETCHING: 
            return {...state, isFetching: action.isFetching}
        case SET_LOOK: 
            return {...state, currentLook: action.currentLook}
        case SET_TOPIC: 
            return {...state, currentTopic: action.currentTopic}
        case TOGGLE_LIKED: 
            return {...state, isLiked: action.isLiked}
        case TOGGLE_DISLIKED: 
            return {...state, isDisliked: action.isDisliked}
        case TOGGLE_WATCHED: 
            return {...state, isWatched: action.isWatched}
        default: 
            return state
    }
}

const setLooks = (looks) => ({ type: SET_LOOKS, looks })
const setTopics = (topics) => ({ type: SET_TOPICS, topics })
const setWatchedTopics = (watchedTopics) => ({ type: SET_WATCHED_TOPICS, watchedTopics })
const setLook = (currentLook) => ({ type: SET_LOOK, currentLook })
const setTopic = (currentTopic) => ({ type: SET_TOPIC, currentTopic })
const toggleIsFetching = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching })
const toggleLiked = (isLiked) => ({ type: TOGGLE_LIKED, isLiked })
const toggleDisliked = (isDisliked) => ({ type: TOGGLE_DISLIKED, isDisliked })
const toggleWatched = (isWatched) => ({ type: TOGGLE_WATCHED, isWatched })


export const requestLooks = (page) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getLooks(page)
    if(response.status == 200){
        dispatch(setLooks(response.data.looks))
        dispatch(setWatchedTopics(response.data.topics))
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

export const watchTopic = (slug) => async (dispatch) => {
    await feedAPI.watchTopic(slug).then(res => {
        dispatch(toggleWatched(true))
    })
    const response = await feedAPI.getLooks(0)
    if(response.status == 200){
        dispatch(setWatchedTopics(response.data.topics))
    }else{
        console.log(response);
    }
}

export const unwatchTopic = (slug) => async (dispatch) => {
    await feedAPI.unwatchTopic(slug).then(res => {
        dispatch(toggleWatched(false))
    })
    const response = await feedAPI.getLooks(0)
    if(response.status == 200){
        dispatch(setWatchedTopics(response.data.topics))
    }else{
        console.log(response);
    }
}

export const requestTopics = () => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getAllTopics()
    if(response.status == 200){
        dispatch(setTopics(response.data.map((topic, index) => ({
            name: topic.name,
            slug: topic.slug, 
            image: topic.image
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
        dispatch(toggleWatched(response.data.isWatched))
        dispatch(toggleIsFetching(false))
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}

