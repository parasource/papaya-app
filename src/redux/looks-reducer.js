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
const SET_CATEGORIES_LOOKS = 'SET_CATEGORIES_LOOKS'
const SET_SEARCH_RESULT_LOOKS = 'SET_SEARCH_RESULT_LOOKS'
const SET_SEARCH_HISTORY = 'SET_SEARCH_HISTORY'
const SET_TOPIC = 'SET_TOPIC'
const SET_RECOMMENDED_TOPICS = 'SET_RECOMMENDED_TOPICS'
const SET_POPULAR_TOPICS = 'SET_POPULAR_TOPICS'

let initialState = {
    looks: [],
    categories: [],
    isFetching: false,
    currentLook: {},
    isLiked: false,
    isDisliked: false,
    todayLook: {},
    currentItem: {},
    categoriesLooks: [],
    isListEnd: false,
    searchResultLooks: [],
    currentTopic: {},
    topicsRecommended: [],
    topicsPopular: [],
    searchHistory: []
}

export const looksReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOOKS: 
            return {...state, looks: [...state.looks, ...action.looks]}
        case SET_CATEGORIES: 
            return {...state, categories: action.categories}
        case SET_CATEGORIES_LOOKS: 
            return {...state, categoriesLooks: action.categoriesLooks}
        case SET_SEARCH_RESULT_LOOKS: 
            return {...state, searchResultLooks: action.searchResultLooks}
        case SET_SEARCH_HISTORY: 
            return {...state, searchHistory: action.searchHistory}
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
        case SET_POPULAR_TOPICS: 
            return {...state, topicsPopular: action.topicsPopular}
        case SET_RECOMMENDED_TOPICS: 
            return {...state, topicsRecommended: action.topicsRecommended}
        case SET_TOPIC: 
            return {...state, currentTopic: action.currentTopic}
        default: 
            return state
    }
}

const setLooks = (looks) => ({ type: SET_LOOKS, looks })
const setCategories = (categories) => ({ type: SET_CATEGORIES, categories })
const setCategoriesLooks = (categoriesLooks) => ({ type: SET_CATEGORIES_LOOKS, categoriesLooks })
const setSearchResultLooks = (searchResultLooks) => ({ type: SET_SEARCH_RESULT_LOOKS, searchResultLooks })
const setSearchHistory = (searchHistory) => ({ type: SET_SEARCH_HISTORY, searchHistory })
const setCurrentItem = (currentItem) => ({ type: SET_ITEM, currentItem })
const setLook = (currentLook) => ({ type: SET_LOOK, currentLook })
const setTodayLook = (todayLook) => ({ type: SET_TODAY_LOOK, todayLook })
const toggleIsFetching = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching })
const toggleLiked = (isLiked) => ({ type: TOGGLE_LIKED, isLiked })
const toggleDisliked = (isDisliked) => ({ type: TOGGLE_DISLIKED, isDisliked })
const toggleIsListEnd = (isListEnd) => ({ type: TOGGLE_IS_LIST_END, isListEnd })
const setCurrentTopic = (currentTopic) => ({ type: SET_TOPIC, currentTopic })
const setRecommendedTopics = (topicsRecommended) => ({ type: SET_RECOMMENDED_TOPICS, topicsRecommended })
const setPopularTopics = (topicsPopular) => ({ type: SET_POPULAR_TOPICS, topicsPopular })


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

export const requestCategoriesLooks = (slug) => async (dispatch) => {
    const response = await feedAPI.getCategoriesLooks(slug)
    if(response.status == 200){
        dispatch(setCategoriesLooks(response.data.looks))
    }else{
        console.log(response);
    }
}

export const requestSearchHistory = (string) => async (dispatch) => {
    const response = await feedAPI.getSearchHistory(string)
    if(response.status == 200){
        dispatch(setSearchHistory(response.data))
    }else{
        console.log(response);
    }
}

export const requestSearchResultLooks = (string) => async (dispatch) => {
    const response = await feedAPI.getSearchResult(string)
    if(response.status == 200){
        dispatch(setSearchResultLooks(
            response.data.looks.map(el => ({...el, type: 'look'})).concat(response.data.topics.map(el => ({...el, type: 'topic'}))).sort((a, b) => a.rank - b.rank)
        ))
    }else{
        console.log(response);
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

export const getCurrentTopic = (slug, page) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getTopic(slug, page)
    if(response.status == 200){
        dispatch(setCurrentTopic(response.data))
        dispatch(toggleIsFetching(false))
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}

export const requestTopics = () => async (dispatch) => {
    const response = await feedAPI.getRecommendedTopics()
    if(response.status == 200){
        dispatch(setRecommendedTopics(response.data))
    }else{
        console.log(response);
    }
    
    const responsePopular = await feedAPI.getPopularTopics()
    if(responsePopular.status == 200){
        dispatch(setPopularTopics(
            responsePopular.data.looks.map(el => ({...el, type: 'look'}))
            .concat(responsePopular.data.topics.map(el => ({...el, type: 'topic'})))
            .map(el => ({...el, sort: Math.random()}))
            .sort((a, b) => a.sort - b.sort)
        ))
    }else{
        console.log(responsePopular);
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