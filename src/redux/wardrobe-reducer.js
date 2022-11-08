import { wardrobeAPI } from "../api/api"

const GET_ALL_WARDROBE = 'GET_ALL_WARDROBE'
const SET_PARENT_CATEGORIES = 'SET_PARENT_CATEGORIES'
const SET_CATEGORIES_WARDROBE = 'SET_CATEGORIES_WARDROBE'
const GET_SELECTED_WARDROBE = 'GET_SELECTED_WARDROBE'
const GET_SELECTED_WARDROBE_THINGS = 'GET_SELECTED_WARDROBE_THINGS'
const GET_SELECTED_WARDROBE_CATEGORIES = 'GET_SELECTED_WARDROBE_CATEGORIES'
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
    selectedWardrobeCategories: [],
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
        case GET_SELECTED_WARDROBE_CATEGORIES:
            return {...state, selectedWardrobeCategories: action.selectedWardrobeCategories}
        case TOGGLE_IS_FETCHING: 
            return {...state, isFetching: action.isFetching}
        case TOGGLE_IS_FETCHING_ID: 
            return {...state, fetchingId: action.fetchingId}
        case ADD_THING: 
            return {...state, selectedWardrobeId: action.selectedWardrobeId}
        case REMOVE_THING: 
            return {...state, selectedWardrobeId: action.selectedWardrobeId}
        default:
            return state;
    }
}

const getAllWardrobe = (wardrobeThings) => ({type: GET_ALL_WARDROBE, wardrobeThings})
const getSelectedWardrobe = (selectedWardrobeId) => ({type: GET_SELECTED_WARDROBE, selectedWardrobeId})
const getSelectedWardrobeThings = (selectedWardrobe) => ({type: GET_SELECTED_WARDROBE_THINGS, selectedWardrobe})
const getSelectedWardrobeCategories = (selectedWardrobeCategories) => ({type: GET_SELECTED_WARDROBE_CATEGORIES, selectedWardrobeCategories})
const getCategories = (categories) => ({type: SET_CATEGORIES_WARDROBE, categories})
const setParentCategories = (parentCategories) => ({type: SET_PARENT_CATEGORIES, parentCategories})
const toggleIsFetching = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching })
const removeThing = (selectedWardrobeId) => ({type: REMOVE_THING, selectedWardrobeId})
const addThing = (selectedWardrobeId) => ({type: ADD_THING, selectedWardrobeId})


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
    console.log(initialState.selectedWardrobeId);
    interests = JSON.stringify({wardrobe: interests})
    await wardrobeAPI.setWardrobe(interests)
}

export const removeThingWardrobe = (id, wardrobe) => (dispatch) => {
    let removeWardrobe = [...wardrobe]
    let index = removeWardrobe.indexOf(id);
    if (index !== -1) {
        removeWardrobe.splice(index, 1);
    }
    let rmInterests = JSON.stringify({wardrobe: removeWardrobe})
    wardrobeAPI.setWardrobe(rmInterests)
    dispatch(removeThing(removeWardrobe))
}

export const addThingWardrobe = (id, wardrobe) => (dispatch) => {
    let addWardrobe = [...wardrobe, id]
    let addInterests = JSON.stringify({wardrobe: addWardrobe})
    wardrobeAPI.setWardrobe(addInterests)
    dispatch(addThing(addWardrobe))
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
        dispatch(getSelectedWardrobeCategories([...new Set(response.data.map(item => item.category_id))]))
        dispatch(getSelectedWardrobe(response.data.map(el => el.id)))
        dispatch(toggleIsFetching(false))
    }else{
        console.log("Wardrobe error: ", response.data.message);
        dispatch(toggleIsFetching(false))
    }
}