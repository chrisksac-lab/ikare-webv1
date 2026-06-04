import axios from "axios";
import {getValue} from "../../services/storage"

const axiosInstance = axios.create({
    baseURL: "http://192.168.153.160:5000",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

axiosInstance.interceptors.request.use((config) => {
    getValue("token")
    .then((value) => {
        if (value) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${value}`
            }
        }
    })
    .catch(error => console.log(error))
})

export default axiosInstance