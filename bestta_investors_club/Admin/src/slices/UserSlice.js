import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi, postApi } from "../components/apicalls";

export const fetchUsers = createAsyncThunk("fetchusers" , async () => {
            
            const res = await getApi("/admin/user")
            return res.data
})

export const updateUser = createAsyncThunk("updateuser" , async (data) => {
    const res = await postApi("/admin/update-user-status",data)
    return res.data
})


const initialState = {
    loader:true,
    Users:[]
}

const UserSlice = createSlice({
    name: "UserSlice",
    initialState,
    reducer:{},
    extraReducers:(builder) => {
                builder.addCase(fetchUsers.pending , (state,action) => {
                        state.loader = true
                        
                })
                builder.addCase(fetchUsers.fulfilled , (state,action) => {
                   
                    if(action.payload.success){
                        state.Users = action.payload
                        state.loader = false
                    }
                })
                builder.addCase(updateUser.pending , (state,action ) => {
                    state.loader = true
                })
                builder.addCase(updateUser.fulfilled , (state,action) => {
                    if(action.payload.success){
                        state.loader = false
                    }
                })
    }
}) 

export default UserSlice.reducer