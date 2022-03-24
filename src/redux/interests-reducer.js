import {interestsAPI} from "../api/api"

const GET_INTERESTS = 'GET_INTERESTS'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'

let initialState = {
    interests: [],
    categories: [],
    userInterests: [],
    isFetching: false,
}

export const interestsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INTERESTS:
            return {...state, ...action.payload}
        case TOGGLE_IS_FETCHING: 
            return {...state, isFetching: action.isFetching}
        default:
            return state;
    }
}

export const getInterests = (interests) => ({type: GET_INTERESTS, payload: {interests}})
export const getCategories = (categories) => ({type: GET_INTERESTS, payload: {categories}})
export const toggleIsFetching = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching })

export const requestInterests = (id) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    let response = await interestsAPI.getInterests()
    if(response.status == 200){
        let interests = response.data.filter(item => item.ID === id)
        interests = interests.map(item => item.items)
        dispatch(getInterests(interests))
        dispatch(toggleIsFetching(false))
    }else{
        console.log("Interests error: ", response.data.message);
        dispatch(toggleIsFetching(false))
    }
}

export const requestCategories = () => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    let response = await interestsAPI.getInterests()
    if(response.status == 200){
        const categories = response.data.map(category => ({name: category.name , id: category.ID}))
        dispatch(getCategories(categories))
        dispatch(toggleIsFetching(false))
    }else{
        console.log("Interests error: ", response.data.message);
        dispatch(toggleIsFetching(false))
    }
}

export const setInterests = (interests) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    let response = await interestsAPI.SetInterests(interests)
    if(response.status == 200){
        const interests = response.data
        let categories = Array.from([...interests].reduce((acc, elem) => acc.add(elem.category), new Set()))
        dispatch(getInterests(interests, categories))
        dispatch(toggleIsFetching(false))
    }else{
        console.log("Interests error: ", response.data.message);
        dispatch(toggleIsFetching(false))
    }
}