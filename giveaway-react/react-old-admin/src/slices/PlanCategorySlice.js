import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi, postApi } from "../components/apicalls";

export const  fetchPlanCategories = createAsyncThunk("getplancategories" , async () => {
            const res =  await getApi("/admin/plan-category")
            return res.data
})

export const addPlanCategories = createAsyncThunk("addplancategory" , async (data) => {
            const res = await postApi("/admin/plan-category",data)
            return res.data
})


export const updatePlanCategories = createAsyncThunk("updateplancategory" , async (data) => {
        const res = await postApi("/admin/update-plan-category",data)
        return res.data
})

const initialState = {
    loader:true,
    planCategories:[]
}


const planCategorySlice = createSlice({
    name : "planCategorySlice",
    initialState,
    reducer:{

    },
    extraReducers:(builder) => {
                builder.addCase(fetchPlanCategories.pending, (state,action) => {
                        state.loader = true
                })
                builder.addCase(fetchPlanCategories.fulfilled , (state,action) => {
                            if(action.payload.success){
                                state.planCategories = action.payload
                                state.loader = false
                            }
                })

                
                builder.addCase(addPlanCategories.fulfilled)

                builder.addCase(updatePlanCategories.fulfilled)

               
    }
})


export default planCategorySlice.reducer