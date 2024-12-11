import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postApi } from "../components/apicalls";

const initialState = null
export const fetchLogin = createAsyncThunk("fetchlogin" , async (data) => {
            const res = await postApi("/admin/login",data)
            return res.data
})

const LoginSlice = createSlice({
    name : "Login",
    initialState,
    reducer: {},
    extraReducers: (builder) => {
            builder.addCase(fetchLogin.fulfilled)
    }
})

export default LoginSlice.reducer