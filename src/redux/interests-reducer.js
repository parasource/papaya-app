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

export const getInterests = (interests, categories) =>
    ({
        type: GET_INTERESTS,
        payload: {interests, categories}
    })

export const requestInterests = () => async (dispatch) => {
    let response = await interestsAPI.getInterests()
    if(response.status == 200){
        const interests = response.data
        let categories = Array.from([...interests].reduce((acc, elem) => acc.add(elem.category), new Set()))
        dispatch(getInterests(interests, categories))
    }else{
        console.log("Interests error: ", response.data.message);
    }
}