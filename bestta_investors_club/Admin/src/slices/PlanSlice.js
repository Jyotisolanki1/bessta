import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi, postApi } from "../components/apicalls";


export const fetchPlans = createAsyncThunk("fetchplans" , async () => {
    const res  = await getApi('/admin/plan')
    return res.data
})

export const addPlan = createAsyncThunk("addplan" , async (data) => {
    const res = await postApi("/admin/add-plan",data)
    return res.data
})

export const updatePlan = createAsyncThunk("updateplan" , async (data) => {
    const res = await postApi("/admin/update-plan",data)
    return res.data
})

const initialState = {
    loader: true,
    plans:[]
}


const planSlice = createSlice({
    name: "PlanSlice",
    initialState,
    reducer:{

    },
    extraReducers:(builder) => {
        builder.addCase(fetchPlans.pending , (state,action) => {
                state.loader = true
        })
        builder.addCase(fetchPlans.fulfilled , (state,action) => {
                if(action.payload.success){
                    state.plans = action.payload
                    state.loader = false
                }
        })
        builder.addCase(addPlan.fulfilled)
        builder.addCase(updatePlan.fulfilled )
    }
})

export default planSlice.reducer
