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
        response.then((res) => {
            setInterseptors(res)
        })
        return response
    },
    register(name, email, password) {
        console.log();
        const response =  instance.post(`auth/register`, {
            name,
            email,
            password
        })
        response.then((res) => {
            setInterseptors(res)
        })
        return response
    }
}

export const interestsAPI = {
    getInterests() {
        return instance.get(`/get-interests`)
    },
    setInterests(interests) {
        return instance.post(`/profile/set-interests`, interests)
    }
}