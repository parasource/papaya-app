import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import * as SecureStore from 'expo-secure-store';

const instance = axios.create({
    baseURL: 'http://api.papaya.parasource.tech/api'
    // baseURL: 'http://api.dev1.papaya.parasource.tech/api'
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

const refreshAuthLogic = async failedRequest => {
    const refresh = await SecureStore.getItemAsync("refresh_token")
    instance.post('/auth/refresh', {"refresh_token": refresh}).then(async (tokenRefreshResponse) => {
        await SecureStore.setItemAsync('token', tokenRefreshResponse.data.token)
        failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.token;
        console.log(tokenRefreshResponse);
        return Promise.resolve();
    }).catch(err => {
        console.log('err', err);
    })
};

createAuthRefreshInterceptor(instance, refreshAuthLogic);


export const authAPI = {
    me() {
        return instance.get(`auth/user`)
    },
    googleLogin(token) {
        return instance.post(`auth/login/google`, {accessToken: token})
    },
    appleLogin(token) {
        return instance.post(`auth/login/apple`, {identityToken: token})
    },
    updateSettings(data) {
        return instance.post('profile/update-settings', data)
    }
}

export const wardrobeAPI = {
    getAllWardrobe() {
        return instance.get(`/get-wardrobe-items`)
    },
    setWardrobe(interests) {
        console.log(interests);
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
        let res = instance.get(`/feed/${slug}`)
        res.then(req => console.log(req.data.looks.length))
        return res
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
    getSaved(){
        return instance.get(`/saved`)
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