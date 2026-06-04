import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../redux/slices/auth/loginSlice"
import registerReducer from "../redux/slices/auth/registerSlice"

const store = configureStore({
    loginSlice: loginReducer,
    registerSlice: registerReducer
})

export default store;