import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const instance = axios.create({
    baseURL: 'http://api.papaya.parasource.tech/api'
    // baseURL: 'http://62.113.102.18/api'
})

instance.interceptors.request.use(
    async config => {
        const token = await SecureStore.getItemAsync('token')
        if (!config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
)

const setInterseptors = (response) => {
    instance.interceptors.request.use(
        config => {
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${response.data.token}`;
            }
            return config;
        }
    )
}

export const authAPI = {
    me() {
        return instance.get(`auth/user`)
    },
    login(values) {
        let response = instance.post(`auth/login`, values)
        .catch(error => {return error = error?.response?.data?.message});
        if(response.status == 200){
            response.then((res) => {
                setInterseptors(res)
            })
        }
        return response
    },
    register(values) {
        let response =  instance.post(`auth/register`, {...values, "sex": "male"})
        .catch(error => {return error?.response?.data?.message});
        if(response.status == 200){
            response.then((res) => {
                setInterseptors(res)
            })
        }
        return response
    }
}

export const wardrobeAPI = {
    getAllWardrobe() {
        return instance.get(`/get-wardrobe-items`)
    },
    setWardrobe(interests) {
        return instance.post(`/profile/set-wardrobe`, interests)
    },
    getSelectedWardrobe() {
        return instance.get(`/profile/get-wardrobe`)
    },
}

export const feedAPI = {
    getLooks(page) {
        return instance.get(`/feed?page=${page}`)
    },
    getCategoriesLooks(slug) {
        return instance.get(`/feed/${slug}`)
    },
    getLook(slug) {
        return instance.get(`/looks/${slug}`)
    },
    getItem(slug, id) {
        return instance.get(`/looks/${slug}/item/${id}`)
    },
    addToFavorited(slug) {
        return instance.put(`/looks/${slug}/favorites`)
    },
    removeFromFavorited(slug) {
        return instance.delete(`/looks/${slug}/favorites`)
    },
    likeLook(slug) {
        return instance.put(`/looks/${slug}/like`)
    },
    unlikeLook(slug) {
        return instance.delete(`/looks/${slug}/like`)
    },
    dislikeLook(slug) {
        return instance.put(`/looks/${slug}/dislike`)
    },
    undislikeLook(slug) {
        return instance.delete(`/looks/${slug}/dislike`)
    },
    getSearchResult(string) {
        return instance.get(`/search?q=${string}&page=0`)
    },
    getSearchHistory(string) {
        if(string){
            return instance.get('/search/suggest?q=' + string)
        }else{
            return instance.get(`/search/history`)
        }
    },
    getRecommendedTopics() {
        return instance.get(`/topics/recommended`)
    },
    getPopularTopics() {
        return instance.get(`/search/popular`)
    },
    getSaved(){
        return instance.get(`/saved`)
    },
    saveLook(slug) {
        return instance.post(`/saved/${slug}`)
    },
    unsaveLook(slug) {
        return instance.delete(`/saved/${slug}`)
    },
}