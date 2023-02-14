import { feedAPI } from "../api/api"

const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const SET_LOOKS = 'SET_LOOKS'
const SET_LOOKS_PAGE = 'SET_LOOKS_PAGE'
const SET_BOOKMARKED = 'SET_BOOKMARKED'
const SET_CATEGORIES = 'SET_CATEGORIES'
const SET_TOPICS = 'SET_TOPICS'
const SET_ARTICLES = 'SET_ARTICLES'
const SET_ITEM = 'SET_ITEM'
const SET_LOOK = 'SET_LOOK'
const TOGGLE_LIKED = 'TOGGLE_LIKED'
const TOGGLE_DISLIKED = 'TOGGLE_DISLIKED'
const TOGGLE_IS_LIST_END = 'TOGGLE_IS_LIST_END'
const TOGGLE_IS_SAVED_END = 'TOGGLE_IS_SAVED_END'
const SET_CATEGORIES_LOOKS = 'SET_CATEGORIES_LOOKS'
const SET_TOPIC = 'SET_TOPIC'
const TOGGLE_IS_SAVE = 'TOGGLE_IS_SAVE'

let initialState = {
    looks: [],
    categories: [],
    isFetching: false,
    currentLook: {},
    isLiked: false,
    isDisliked: false,
    currentItem: {},
    categoriesLooks: [],
    isListEnd: false,
    isSavedEnd: false,
    currentTopic: {},
    isSaved: false,
    topics: [],
    articles: [],
    bookmarked: [],
}

export const looksReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOOKS_PAGE: 
            return {...state, looks: [...state.looks, ...action.looks]}
        case SET_TOPICS: 
            return {...state, topics: action.topics}
        case SET_ARTICLES: 
            return {...state, articles: action.articles}
        case SET_LOOKS: 
            return {...state, looks: action.looks}
        case SET_BOOKMARKED: 
            return {...state, bookmarked: action.bookmarked}
        case SET_CATEGORIES: 
            return {...state, categories: action.categories}
        case SET_CATEGORIES_LOOKS: 
            return {...state, categoriesLooks: action.categoriesLooks}
        case SET_ITEM: 
            return {...state, currentItem: action.currentItem}
        case TOGGLE_IS_FETCHING: 
            return {...state, isFetching: action.isFetching}
        case SET_LOOK: 
            return {...state, currentLook: action.currentLook}
        case TOGGLE_LIKED: 
            return {...state, isLiked: action.isLiked}
        case TOGGLE_DISLIKED: 
            return {...state, isDisliked: action.isDisliked}
        case TOGGLE_IS_LIST_END: 
            return {...state, isListEnd: action.isListEnd}
        case TOGGLE_IS_SAVED_END: 
            return {...state, isSavedEnd: action.isSavedEnd}
        case TOGGLE_IS_SAVE: 
            return {...state, isSaved: action.isSaved}
        case SET_TOPIC: 
            return {...state, currentTopic: action.currentTopic}
        default: 
            return state
    }
}

const setLooks = (looks) => ({ type: SET_LOOKS, looks })
const setTopics = (topics) => ({ type: SET_TOPICS, topics })
const setArticles = (articles) => ({ type: SET_ARTICLES, articles })
const setLooksPage = (looks) => ({ type: SET_LOOKS_PAGE, looks })
const setCategories = (categories) => ({ type: SET_CATEGORIES, categories })
const setCategoriesLooks = (categoriesLooks) => ({ type: SET_CATEGORIES_LOOKS, categoriesLooks })
const setCurrentItem = (currentItem) => ({ type: SET_ITEM, currentItem })
const setLook = (currentLook) => ({ type: SET_LOOK, currentLook })
const toggleIsFetching = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching })
const toggleLiked = (isLiked) => ({ type: TOGGLE_LIKED, isLiked })
const toggleDisliked = (isDisliked) => ({ type: TOGGLE_DISLIKED, isDisliked })
const toggleIsListEnd = (isListEnd) => ({ type: TOGGLE_IS_LIST_END, isListEnd })
const toggleIsSavedEnd = (isSavedEnd) => ({ type: TOGGLE_IS_SAVED_END, isSavedEnd })
const toggleIsSaved = (isSaved) => ({ type: TOGGLE_IS_SAVE, isSaved })
const setCurrentTopic = (currentTopic) => ({ type: SET_TOPIC, currentTopic })
const setBookmarked = (bookmarked) => ({ type: SET_BOOKMARKED, bookmarked })


export const requestLooks = (page, onRefresh) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getLooks(page)
    if(response.status == 200){
        if(onRefresh){
            dispatch(setLooks(response.data.looks))
            dispatch(setCategories(response.data.categories))
            dispatch(setArticles(response.data.articles))
            console.log(response.data.articles);
            dispatch(setTopics(response.data.topics))
            dispatch(toggleIsFetching(false))
            dispatch(toggleIsListEnd(false))
        }else{
            if(!response.data.looks || !response.data.looks.length){
                dispatch(toggleIsListEnd(true))
                dispatch(toggleIsFetching(false))
            }else{
                dispatch(setLooksPage(response.data.looks))
                dispatch(setCategories(response.data.categories))
                dispatch(setArticles(response.data.articles))
                dispatch(setTopics(response.data.topics))
                dispatch(toggleIsFetching(false))
            }
        }
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}

export const requestCategoriesLooks = (slug) => async (dispatch) => {
    if(slug){
        dispatch(toggleIsFetching(true))
        dispatch(setCategoriesLooks([]))
        dispatch(toggleIsListEnd(false))
        const response = await feedAPI.getCategoriesLooks(slug)
        if(response.status == 200){
            dispatch(setCategoriesLooks(response.data.looks))
            dispatch(toggleIsFetching(false))
        }else{
            console.log(response);
            dispatch(toggleIsFetching(false))
        }
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
        dispatch(toggleIsSaved(response.data.isSaved))
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

export const saveLook = (slug) => async (dispatch) => {
    await feedAPI.saveLook(slug).then(res => {
        dispatch(toggleIsSaved(true))
        feedAPI.getSaved().then(response => {
            dispatch(setBookmarked(response.data))
        })
    })
}

export const unsaveLook = (slug) => async (dispatch) => {
    await feedAPI.unsaveLook(slug).then(res => {
        dispatch(toggleIsSaved(false))
        feedAPI.getSaved().then(response => {
            dispatch(setBookmarked(response.data))
        })
    })
}

export const requestBookmarked = (page, onRefresh) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getSaved(page)
    if(response.status == 200){
        if(onRefresh){
            dispatch(setBookmarked(response.data))
            dispatch(toggleIsSavedEnd(false))
            dispatch(toggleIsFetching(false))
        }else{
            if(!response.data || !response.data.length){
                dispatch(toggleIsSavedEnd(true))
                dispatch(toggleIsFetching(false))
            }else{
                dispatch(setBookmarked(response.data))
                dispatch(toggleIsFetching(false))
            }
        }
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}
