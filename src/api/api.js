import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import * as SecureStore from 'expo-secure-store';
import { checkToken } from '../redux/auth-reducer';

const instance = axios.create({
    baseURL: 'https://api.papaya.parasource.tech/api/v2'
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

const refreshAuthLogic = async failedRequest => {
    const refresh = await SecureStore.getItemAsync("refresh_token")
    instance.post('/auth/refresh', {"refresh_token": refresh}).then(async (tokenRefreshResponse) => {
        await SecureStore.setItemAsync('token', tokenRefreshResponse.data.token)
        failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.token;
        return Promise.resolve();
    }).catch(err => {
        SecureStore.deleteItemAsync('token', null)
        SecureStore.deleteItemAsync('refresh_token', null)
        checkToken()
        console.log('err', err);
    })
};

createAuthRefreshInterceptor(instance, refreshAuthLogic, {statusCodes: [401, 403]});


export const authAPI = {
    me() {
        return instance.get(`auth/user`)
    },
    remove(){
        return instance.get(`profile/remove`)
    },
    googleLogin(token) {
        return instance.post(`auth/login/google`, {accessToken: token})
    },
    appleLogin(token) {
        return instance.post(`auth/login/apple`, {identityToken: token})
    },
    updateSettings(data) {
        return instance.post('profile/update-settings', data)
    },
    setAPNS(token) {
        return instance.post('profile/set-apns-token', {apns_token: token})
    },
    sendLogs(error, isFatal){
        return instance.post('frontend/error-logs', {message: error, isFatal: isFatal})
    }
}

export const wardrobeAPI = {
    getAllWardrobe() {
        return instance.get(`/get-wardrobe-items`)
    },
    getCategories() {
        return instance.get(`/wardrobe`)
    },
    getWardrobeById(id) {
        return instance.get(`/wardrobe/${id}`)
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
    getSearchHistory() {
        return instance.get(`/search/suggestions`)
    },
    getAutofill(string) {
        return instance.get(`/search/autofill?q=${string}`)
    },
    getRecommendedTopics() {
        return instance.get(`/topics/recommended`)
    },
    getPopularTopics() {
        return instance.get(`/search/popular`)
    },
    getSaved(page){
        return instance.get(`/saved?page=${page}`)
    },
    saveLook(slug) {
        return instance.post(`/saved/${slug}`)
    },
    unsaveLook(slug) {
        return instance.delete(`/saved/${slug}`)
    },
    clearHistory() {
        return instance.post('/search/clear-history')
    },
    getTopic(slug, page) {
        return instance.get(`/topics/${slug}?page=${page}`)
    },
}