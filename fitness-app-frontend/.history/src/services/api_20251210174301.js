import axios from "axios";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem("token");
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        // return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getActivities = () => api.get("/activities");
export const addActivities = () => api.get("/activity", activity);
export const getActivityDetails = () => api.get("/recommendations/activity/");