import { wardrobeAPI } from "../api/api"

const GET_ALL_WARDROBE = 'GET_ALL_WARDROBE'
const SET_PARENT_CATEGORIES = 'SET_PARENT_CATEGORIES'
const SET_CATEGORIES_WARDROBE = 'SET_CATEGORIES_WARDROBE'
const GET_SELECTED_WARDROBE = 'GET_SELECTED_WARDROBE'
const GET_SELECTED_WARDROBE_THINGS = 'GET_SELECTED_WARDROBE_THINGS'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const TOGGLE_IS_FETCHING_ID = 'TOGGLE_IS_FETCHING_ID'
const ADD_THING = 'ADD_THING'
const REMOVE_THING = 'REMOVE_THING'

let initialState = {
    wardrobeThings: [],
    categories: [],
    parentCategories: [],
    userInterests: [],
    isFetching: false,
    selectedWardrobe: [],
    selectedWardrobeId: [],
    fetchingId: 0
}

export const wardrobeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_WARDROBE:
            return {...state, wardrobeThings: action.wardrobeThings}
        case SET_CATEGORIES_WARDROBE:
            return {...state, categories: action.categories}
        case SET_PARENT_CATEGORIES:
            return {...state, parentCategories: action.parentCategories}
        case GET_SELECTED_WARDROBE:
            return {...state, selectedWardrobeId: action.selectedWardrobeId}
        case GET_SELECTED_WARDROBE_THINGS:
            return {...state, selectedWardrobe: action.selectedWardrobe}
        case TOGGLE_IS_FETCHING: 
            return {...state, isFetching: action.isFetching}
        case TOGGLE_IS_FETCHING_ID: 
            return {...state, fetchingId: action.fetchingId}
        case ADD_THING: 
            let addWardrobe = [...state.selectedWardrobeId, action.payload.id]
            return {...state, selectedWardrobeId: addWardrobe}
        case REMOVE_THING: 
            let removeWardrobe = [...state.selectedWardrobeId]
            let index = removeWardrobe.indexOf(action.payload.id);
            if (index !== -1) {
                removeWardrobe.splice(index, 1);
            }
            return {...state, selectedWardrobeId: removeWardrobe}
        default:
            return state;
    }
}

const getAllWardrobe = (wardrobeThings) => ({type: GET_ALL_WARDROBE, wardrobeThings})
const getSelectedWardrobe = (selectedWardrobeId) => ({type: GET_SELECTED_WARDROBE, selectedWardrobeId})
const getSelectedWardrobeThings = (selectedWardrobe) => ({type: GET_SELECTED_WARDROBE_THINGS, selectedWardrobe})
const getCategories = (categories) => ({type: SET_CATEGORIES_WARDROBE, categories})
const setParentCategories = (parentCategories) => ({type: SET_PARENT_CATEGORIES, parentCategories})
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

export const requestWardrobe = (id) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    let response = await wardrobeAPI.getWardrobeById(id)
    if(response.status == 200){
        dispatch(getAllWardrobe(response.data))
        dispatch(toggleIsFetching(false))
    }else{
        console.log("Wardrobe error: ", response.data.message);
        dispatch(toggleIsFetching(false))
    }
}

export const requestCategories = () => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    let response = await wardrobeAPI.getCategories()
    if(response.status == 200){
        const categories = response.data.map(category => ({name: category.name, id: category.ID, preview: category.preview, parent_category: category.parent_category, items_count: category.items_count}))
        const parentCategories = [...new Set(categories.map(item => item.parent_category))];
        dispatch(getCategories(categories))
        dispatch(setParentCategories(parentCategories))
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

export const removeThingWardrobe = (id) => (dispatch) => {
    dispatch(removeThing(id))
}

export const addThingWardrobe = (id) => (dispatch) => {
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

export const requestSelectedWardrobeThings = (id) => async (dispatch) => {
    dispatch(toggleIsFetching(true))
    let response = await wardrobeAPI.getSelectedWardrobe()
    if(response.status == 200){
        let wardrobeThings = response.data.filter(item => item.category_id === id)
        dispatch(getSelectedWardrobeThings(wardrobeThings))
        dispatch(getSelectedWardrobe(response.data.map(el => el.id)))
        dispatch(toggleIsFetching(false))
    }else{
        console.log("Wardrobe error: ", response.data.message);
        dispatch(toggleIsFetching(false))
    }
}