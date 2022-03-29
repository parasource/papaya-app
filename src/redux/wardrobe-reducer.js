import { wardrobeAPI } from "../api/api"

const GET_ALL_WARDROBE = 'GET_ALL_WARDROBE'
const GET_SELECTED_WARDROBE = 'GET_SELECTED_WARDROBE'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'

let initialState = {
    wardrobeThings: [],
    categories: [],
    userInterests: [],
    isFetching: false,
    selectedWardrobe: []
}

export const wardrobeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_WARDROBE:
            return {...state, ...action.payload}
        case GET_SELECTED_WARDROBE:
            return {...state, ...action.payload}
        case TOGGLE_IS_FETCHING: 
            return {...state, isFetching: action.isFetching}
        default:
            return state;
    }
}

export const getAllWardrobe = (wardrobeThings) => ({type: GET_ALL_WARDROBE, payload: {wardrobeThings}})
export const getSelectedWardrobe = (selectedWardrobe) => ({type: GET_SELECTED_WARDROBE, payload: {selectedWardrobe}})
export const getCategories = (categories) => ({type: GET_ALL_WARDROBE, payload: {categories}})
export const toggleIsFetching = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching })

export const requestAllWardrobe = (id) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    let response = await wardrobeAPI.getAllWardrobe()
    if(response.status == 200){
        let wardrobeThings = response.data.filter(item => item.ID === id)
        wardrobeThings = wardrobeThings.map(item => item.items)
        dispatch(getAllWardrobe(wardrobeThings))
        dispatch(toggleIsFetching(false))
    }else{
        console.log("Wardrobe error: ", response.data.message);
        dispatch(toggleIsFetching(false))
    }
}

export const requestCategories = () => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    let response = await wardrobeAPI.getAllWardrobe()
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
    let response = await wardrobeAPI.setWardrobe(interests)
    try{
        console.log(response.data);
    }catch(err){
        console.log("Interests error: ", err);
    }
}

export const requestSelectedWardrobe = () => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    let response = await wardrobeAPI.getSelectedWardrobe()
    if(response.status == 200){
        dispatch(getSelectedWardrobe(response.data))
        dispatch(toggleIsFetching(false))
    }else{
        console.log("Wardrobe error: ", response.data.message);
        dispatch(toggleIsFetching(false))
    }
    console.log(response.data);
}