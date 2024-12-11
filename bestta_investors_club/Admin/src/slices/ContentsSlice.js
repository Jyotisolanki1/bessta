import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi, postApi } from "../components/apicalls";

export const fetchContents = createAsyncThunk("fetchcontents" , async () => {
    const res = await getApi("/admin/get-static-content")
    return res.data
})

export const updateContents = createAsyncThunk("updatecontents" , async (data)  => {
    const res  =  await postApi("/admin/update-static-content",data)
    console.log(res, "cecking updated")
    return res.data
})

const initialState = {
    Contents: [],
    loader:true
}

const ContentsSlice = createSlice({
            name : "ContentSlice",
            initialState,
            reducer:{},
            extraReducers:(builder) => {
                    builder.addCase(fetchContents.pending,(state,action) => {
                            state.loader = true
                    })
                    builder.addCase(fetchContents.fulfilled , (state,action) => {
                            if(action.payload.success){
                                state.Contents = action.payload
                                state.loader = false
                            }
                    })
                    builder.addCase(updateContents.pending , (state,action) => {
                                state.loader = true
                    })
                    builder.addCase(updateContents.fulfilled, (state,action) => {
                            if(action.payload.success){
                                state.loader = false
                            }
                    })
            }
})


export default ContentsSlice.reducer