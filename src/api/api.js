import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const instance = axios.create({
    baseURL: 'http://papaya-api.lightswitch.digital/api'
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