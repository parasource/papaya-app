import { wardrobeAPI } from "../api/api"

const GET_ALL_WARDROBE = 'GET_ALL_WARDROBE'
const GET_SELECTED_WARDROBE = 'GET_SELECTED_WARDROBE'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const TOGGLE_IS_FETCHING_ID = 'TOGGLE_IS_FETCHING_ID'
const ADD_THING = 'ADD_THING'
const REMOVE_THING = 'REMOVE_THING'

let initialState = {
    wardrobeThings: [],
    categories: [],
    userInterests: [],
    isFetching: false,
    selectedWardrobe: [],
    selectedWardrobeId: [],
    fetchingId: 0
}

export const wardrobeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_WARDROBE:
            return {...state, ...action.payload}
        case GET_SELECTED_WARDROBE:
            return {...state, ...action.payload}
        case TOGGLE_IS_FETCHING: 
            return {...state, isFetching: action.isFetching}
        case TOGGLE_IS_FETCHING_ID: 
            return {...state, fetchingId: action.fetchingId}
        case ADD_THING: 
            let addWardrobe = [...state.selectedWardrobeId]
            addWardrobe.push(action.payload.id)
            return {...state, selectedWardrobeId: addWardrobe}
        case REMOVE_THING: 
            let removeWardrobe = [...state.selectedWardrobeId]
            let index = removeWardrobe.indexOf(action.payload.id);
            if (index !== -1) {
                removeWardrobe.splice(index, 1);
            }
            console.log(removeWardrobe);
            return {...state, selectedWardrobeId: removeWardrobe}
        default:
            return state;
    }
}

const getAllWardrobe = (wardrobeThings) => ({type: GET_ALL_WARDROBE, payload: {wardrobeThings}})
const getSelectedWardrobe = (selectedWardrobeId) => ({type: GET_SELECTED_WARDROBE, payload: {selectedWardrobeId}})
const getCategories = (categories) => ({type: GET_ALL_WARDROBE, payload: {categories}})
const toggleIsFetching = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching })
const removeThing = (id) => ({type: REMOVE_THING, payload: {id}})
const addThing = (id) => ({type: ADD_THING, payload: {id}})


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
    interests = JSON.stringify({wardrobe: interests})
    await wardrobeAPI.setWardrobe(interests)
}

export const removeThingWardrobe = (id) => async (dispatch) => {
    dispatch(removeThing(id))
}

export const addThingWardrobe = (id) => async (dispatch) => {
    dispatch(addThing(id))
}



export const requestSelectedWardrobe = () => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    let response = await wardrobeAPI.getSelectedWardrobe()
    if(response.status == 200){
        dispatch(getSelectedWardrobe(response.data.map(el => el.id)))
        dispatch(toggleIsFetching(false))
    }else{
        console.log("Wardrobe error: ", response.data.message);
        dispatch(toggleIsFetching(false))
    }
}