import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postApi } from "../components/apicalls";

export const changePassword = createAsyncThunk("changepassword" ,async (data) => {
    const res  = await postApi("/admin/change-password",data)
    return res.data
})


const initialState = null

const ChangePasswordSlice = createSlice({
    name : "ChangePassword",
    initialState,
    reducer:{},
    extraReducers:(builder) => {
                builder.addCase(changePassword.fulfilled )
    }
})

export default ChangePasswordSlice.reducer