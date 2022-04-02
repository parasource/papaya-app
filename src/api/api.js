import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const instance = axios.create({
    baseURL: 'https://papaya-api.lightswitch.digital/api'
    // baseURL: 'http://127.0.0.1:8000/api'
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
    getLook(slug) {
        return instance.get(`/looks/${slug}`)
    },
    getAllTopics() {
        return instance.get(`/topics`)
    },
    getTopic(slug, page) {
        return instance.get(`/topics/${slug}?page=${page}`)
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
    pinTopic(slug) {
        return instance.put(`/topics/${slug}/watch`)
    }
}