import {interestsAPI} from "../api/api"

const GET_INTERESTS = 'GET_INTERESTS'

let initialState = {
    interests: [],
    categories: [],
    userInterests: []
}

export const interestsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INTERESTS:
            return {
                ...state,
                ...action.payload
            }
            default:
                return state;
    }
}

export const getInterests = (interests) =>
    ({
        type: GET_INTERESTS,
        payload: {interests}
    })

export const getCategories = (categories) =>
    ({
        type: GET_INTERESTS,
        payload: {categories}
    })

export const requestInterests = (id) => async (dispatch) => {
    let response = await interestsAPI.getInterests()
    if(response.status == 200){
        let interests = response.data.filter(item => item.ID === id)
        interests = interests.map(item => item.items)
        dispatch(getInterests(interests))
    }else{
        console.log("Interests error: ", response.data.message);
    }
}

export const requestCategories = () => async (dispatch) => {
    let response = await interestsAPI.getInterests()
    if(response.status == 200){
        const categories = response.data.map(category => ({name: category.name , id: category.ID}))
        dispatch(getCategories(categories))
    }else{
        console.log("Interests error: ", response.data.message);
    }
}

export const setInterests = (interests) => async (dispatch) => {
    let response = await interestsAPI.SetInterests(interests)
    if(response.status == 200){
        const interests = response.data
        let categories = Array.from([...interests].reduce((acc, elem) => acc.add(elem.category), new Set()))
        dispatch(getInterests(interests, categories))
    }else{
        console.log("Interests error: ", response.data.message);
    }
}