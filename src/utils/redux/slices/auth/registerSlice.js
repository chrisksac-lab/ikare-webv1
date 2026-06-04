import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance/axiosInstance"

const registerUser = {
    fullName: "",
    email: "",
    matricle: "",
    password: "",
    telNumber: ""
}

export const register = createAsyncThunk(
    "registerSlice", async (registerUser, thunkAPI) => {
        const url = "/api/auth/register"
        axiosInstance.post(url, registerUser)
        .then(resp => {
            return resp;
        })
        .catch(err => {
            thunkAPI.rejectWithValue(err.response)
        })
    }
)

export const registerSlice = createSlice({
    name: "registerSlice",
    initialState: registerUser,
    reducers: {
        userRegistration: (state, action) => {
            state = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending)
        .addCase(register.fulfilled, (state, action) => {
            console.log("Fulfilled", state)
        })      
        .addCase(register.rejected, (state, action) => {
            console.log("Rejected", action)
        })
    }
})

export const {userRegistration} = registerSlice.actions
export default registerSlice.reducer