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

export const interestsAPI = {
    getInterests() {
        return instance.get(`/get-wardrobe-items`)
    },
    setInterests(interests) {
        return instance.post(`/profile/set-interests`, interests)
    }
}

export const feedAPI = {
    getLooks(page) {
        return instance.get(`/feed/${page}`)
    },
    getLook(slug) {
        return instance.get(`/looks/${slug}`)
    }
}