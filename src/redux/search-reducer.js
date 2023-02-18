import { feedAPI } from "../api/api"

const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const SET_SEARCH_RESULT_LOOKS = 'SET_SEARCH_RESULT_LOOKS'
const SET_SEARCH_HISTORY = 'SET_SEARCH_HISTORY'
const SET_AUTOFILL = 'SET_AUTOFILL'
const SET_RECOMMENDED_TOPICS = 'SET_RECOMMENDED_TOPICS'
const SET_POPULAR_TOPICS = 'SET_POPULAR_TOPICS'
const SET_SEARCH_ITEMS = 'SET_SEARCH_ITEMS'

let initialState = {
    isFetching: false,
    searchResultLooks: [],
    topicsRecommended: [],
    topicsPopular: [],
    searchHistory: [],
    searchItems: [],
    autofill: []
}

export const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SEARCH_RESULT_LOOKS: 
            return {...state, searchResultLooks: action.searchResultLooks}
        case SET_SEARCH_HISTORY: 
            return {...state, searchHistory: action.searchHistory}
        case SET_SEARCH_ITEMS: 
            return {...state, searchItems: action.searchItems}
        case TOGGLE_IS_FETCHING: 
            return {...state, isFetching: action.isFetching}
        case SET_POPULAR_TOPICS: 
            return {...state, topicsPopular: action.topicsPopular}
        case SET_RECOMMENDED_TOPICS: 
            return {...state, topicsRecommended: action.topicsRecommended}
        case SET_AUTOFILL: 
            return {...state, autofill: action.autofill}
        default: 
            return state
    }
}

const setSearchResultLooks = (searchResultLooks) => ({ type: SET_SEARCH_RESULT_LOOKS, searchResultLooks })
const setSearchHistory = (searchHistory) => ({ type: SET_SEARCH_HISTORY, searchHistory })
const toggleIsFetching = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching })
const setRecommendedTopics = (topicsRecommended) => ({ type: SET_RECOMMENDED_TOPICS, topicsRecommended })
const setPopularTopics = (topicsPopular) => ({ type: SET_POPULAR_TOPICS, topicsPopular })
const setAutofill = (autofill) => ({ type: SET_AUTOFILL, autofill })
const setSearchItems = (searchItems) => ({ type: SET_SEARCH_ITEMS, searchItems })

export const requestSearchHistory = () => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    const response = await feedAPI.getSearchHistory()
    if(response.status == 200){
        dispatch(setSearchHistory(response.data.search))
        dispatch(setPopularTopics(response.data.looks))
        dispatch(setRecommendedTopics(response.data.topics))
        dispatch(toggleIsFetching(false))
    }else{
        console.log(response);
        dispatch(toggleIsFetching(false))
    }
}

export const requestAutofill = (string) => async (dispatch) => {
    const response = await feedAPI.getAutofill(string)
    if(response.status == 200 || response.status == 204){
        dispatch(setAutofill(response.data))
    }else{
        console.log('autofill', response.status);
    }
}

export const requestSearchResultLooks = (string) => async (dispatch) => {
    const response = await feedAPI.getSearchResult(string)
    if(response.status == 200){
        dispatch(setSearchResultLooks(response.data.looks ? 
            response.data.looks.map(el => ({...el, type: 'look'}))
            : []
            // .concat(response.data.topics.map(el => ({...el, type: 'topic'}))).sort((a, b) => a.rank - b.rank)
        ))
        dispatch(setSearchItems(response.data.wardrobe_items))
    }else{
        console.log(response);
    }
}

export const clearHistoryHandler = () => async (dispatch) => {
    const response = await feedAPI.clearHistory()
    if(response.status == 200){
        const responseHistory = await feedAPI.getSearchHistory()
        if(responseHistory.status == 200){
            dispatch(setSearchHistory(responseHistory.data.search))
        }else{
            console.log(responseHistory);
        }
    }else{
        console.log(response);
    }
}
