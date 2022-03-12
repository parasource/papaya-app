import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api'
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
        const response = instance.post(`auth/login`, values)
        .catch(error => {return error = error?.response?.data?.message});
        response.then((res) => {
            setInterseptors(res)
        })
        return response
    },
    register(values) {
        console.log();
        const response =  instance.post(`auth/register`, values)
        .catch(error => {return error?.response?.data?.message});
        response.then((res) => {
            setInterseptors(res)
        })
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