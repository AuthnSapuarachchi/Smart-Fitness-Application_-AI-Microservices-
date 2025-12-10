import axios from "axios";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_URL,
});


api.interceptors.request.use(
    (config) => {
        const userId = localStorage.getItem('userid')
        const token = localStorage.getItem('token')
        
        if (userId) {
            config.headers['X-User-ID'] = userId
        }
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.data)
        return response
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.response?.data)
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('userid')
            localStorage.removeItem('user')
            window.location.href = '/'
        }
        return Promise.reject(error)
    }
)


export const getActivities = () => api.get("/activities");
export const addActivity = (activity) => api.post("/activities", activity);
export const getActivityDetails = () => api.get("/recommendations/activity/${id}");