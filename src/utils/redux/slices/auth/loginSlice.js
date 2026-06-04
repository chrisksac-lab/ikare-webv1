import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance/axiosInstance"


const loginUser = {
    email: "",
    password: ""
}

export const logIn = createAsyncThunk(
    "loginSlice/logIn", async (loginUser, thunkAPI) => {
        const url = "/api/auth/login";
        try {
            const response = await axiosInstance.post(url, loginUser)
            return response.data
        } catch(error) {
            return thunkAPI.rejectWithValue(error.response)
        }
    }
)

export const loginSlice = createSlice({
    name: "loginSlice",
    initialState: loginUser,
    reducers: {
        loginRegistration: (state, action) => {
            state = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(logIn.pending)
        .addCase(logIn.fulfilled, (state, action) => {
            console.log("Fulfilled", state)
        })
        .addCase(logIn.rejected, (state, action) => {
            console.log("Rejected", action)
        })
    }
})

export const {loginRegistration} = loginSlice.actions
export default loginSlice.reducer
