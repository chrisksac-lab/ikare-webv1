import { io } from "socket.io-client";
import axiosInstance from "./axiosInstance/axiosInstance";
const socket = io(axiosInstance.getUri());
export default socket;