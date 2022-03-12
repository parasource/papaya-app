import axios from "axios";
import * as SecureStore from 'expo-secure-store';

function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

     //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        
        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

const instance = axios.create({
    baseURL: 'http://' + getUserIP() + ':8000/api'
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
        let response =  instance.post(`auth/register`, values)
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