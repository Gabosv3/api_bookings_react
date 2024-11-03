import axios from "axios";

const token = sessionStorage.getItem('token_bookings');

export const defaultAxios = axios.create({
    //baseURL: import.meta.env.VITE_API_URL,
    baseURL: "https://apibookingsaccomodations-production.up.railway.app/api/V1",
    headers: {
        "Accept": 'application/json',
        "Content-Type": "application/json"
    }
});

export const defaultAxiosWithToken = axios.create({
    //baseURL: import.meta.env.VITE_API_URL,
    baseURL: "https://apibookingsaccomodations-production.up.railway.app/api/V1",
    headers: {
        "Accept": 'application/json',
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
    }
});
