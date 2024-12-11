import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postApi } from "../components/apicalls";
import { getApi } from "../components/apicalls";

export const fetchDraws = createAsyncThunk("fetchdraws" , async () => {
        const res = await getApi("/admin/draw")
        return res.data
})

export const addDraw = createAsyncThunk("adddraw" , async  (data) => {
        const res = await postApi("/admin/add-draw",data)
        return res.data
})

export const updateDraw = createAsyncThunk("updatedraw" , async (data) => {
        const res = await postApi("/admin/update-draw",data)
        return res.data
})

const initialState = {
    loader:true,
    Draws:[]
}


const drawSlice = createSlice({
    name:"DrawSice",
    initialState,
    reducer:{},
    extraReducers:(builder) => {
            builder.addCase(fetchDraws.pending , (state ,action) => {
                    state.loader = true
            })
            builder.addCase(fetchDraws.fulfilled , (state,action) => {
                    if(action.payload.success){
                        state.Draws = action.payload
                        state.loader = false
                    }
            })

       
            builder.addCase(addDraw.fulfilled )
            builder.addCase(updateDraw.fulfilled )
    }
})

export default drawSlice.reducer